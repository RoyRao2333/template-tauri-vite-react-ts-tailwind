import { readdir, readFile, rename, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

type RenameArgs = {
  name?: string;
  id?: string;
};

type AppContext = {
  rootDir: string;
  rootPackagePath: string;
  rootPackage: RootPackage;
  appDir: string;
  appPackagePath: string;
  appPackage: AppPackage;
  tauriConfigPath: string;
  cargoTomlPath: string;
  mainRsPath: string;
  appReadmePath: string;
};

type RootPackage = {
  name: string;
  scripts?: Record<string, string>;
};

type AppPackage = {
  name: string;
  private?: boolean;
  version?: string;
  type?: string;
  scripts?: Record<string, string>;
};

const rootDir = path.resolve(process.cwd());

function parseArgs(argv: string[]): RenameArgs {
  const result: RenameArgs = {};

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];

    if (!current.startsWith('--')) {
      continue;
    }

    const [flag, inlineValue] = current.split('=', 2);
    const readValue = () => inlineValue ?? argv[index + 1];

    if (flag === '--name') {
      result.name = readValue();
      if (inlineValue === undefined) {
        index += 1;
      }
      continue;
    }

    if (flag === '--id') {
      result.id = readValue();
      if (inlineValue === undefined) {
        index += 1;
      }
      continue;
    }

    if (flag === '--help' || flag === '-h') {
      printHelpAndExit();
    }
  }

  return result;
}

function printHelpAndExit(): never {
  console.log(
    [
      'Usage:',
      '  pnpm rename --name "My App" --id com.example.my-app',
      '',
      'Flags:',
      '  --name   Project name from create-tauri-app',
      '  --id     Bundle identifier from create-tauri-app',
    ].join('\n'),
  );
  process.exit(0);
}

function assertNonEmpty(value: string | undefined, label: string): string {
  const trimmed = value?.trim();
  if (!trimmed) {
    throw new Error(`Missing required ${label}.`);
  }
  return trimmed;
}

function toValidPkgName(input: string): string {
  const normalized = input
    .toLowerCase()
    .replace(/[:;\s~]/g, '-')
    .replace(/[./\\]/g, '')
    .replace(/^[\d-]+/, '');

  return normalized || 'tauri-app';
}

function toKebabPackageName(input: string): string {
  const words = input
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .replace(/[_:;\s~./\\]+/g, '-')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^[\d-]+/, '');

  return words || 'tauri-app';
}

function toRustLibName(packageName: string): string {
  return `${packageName.replace(/-/g, '_')}_lib`;
}

async function readJson<T>(filePath: string): Promise<T> {
  return JSON.parse(await readFile(filePath, 'utf8')) as T;
}

async function writeJson(filePath: string, value: unknown): Promise<void> {
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

async function locateAppContext(): Promise<AppContext> {
  const rootPackagePath = path.join(rootDir, 'package.json');
  const rootPackage = await readJson<RootPackage>(rootPackagePath);

  const appsDir = path.join(rootDir, 'apps');
  const appEntries = await readdir(appsDir, { withFileTypes: true });
  const candidates = await Promise.all(
    appEntries
      .filter((entry) => entry.isDirectory())
      .map(async (entry) => {
        const appDir = path.join(appsDir, entry.name);
        const appPackagePath = path.join(appDir, 'package.json');
        const tauriConfigPath = path.join(
          appDir,
          'src-tauri',
          'tauri.conf.json',
        );
        const cargoTomlPath = path.join(appDir, 'src-tauri', 'Cargo.toml');
        const mainRsPath = path.join(appDir, 'src-tauri', 'src', 'main.rs');
        const appReadmePath = path.join(appDir, 'README.md');

        try {
          await Promise.all([
            stat(appPackagePath),
            stat(tauriConfigPath),
            stat(cargoTomlPath),
            stat(mainRsPath),
            stat(appReadmePath),
          ]);
        } catch {
          return null;
        }

        const appPackage = await readJson<AppPackage>(appPackagePath);

        if (!appPackage.name?.startsWith('@app/')) {
          return null;
        }

        return {
          rootDir,
          rootPackagePath,
          rootPackage,
          appDir,
          appPackagePath,
          appPackage,
          tauriConfigPath,
          cargoTomlPath,
          mainRsPath,
          appReadmePath,
        };
      }),
  );

  const context = candidates.find(
    (candidate): candidate is AppContext => candidate !== null,
  );
  if (!context) {
    throw new Error('Cannot locate the Tauri app workspace under apps/*.');
  }

  return context;
}

async function updateCargoToml(
  filePath: string,
  packageName: string,
  authors: string[],
  libName: string,
): Promise<void> {
  const original = await readFile(filePath, 'utf8');
  const lines = original.split('\n');
  let inPackage = false;
  let inLib = false;
  let packageNameUpdated = false;
  let authorsUpdated = false;
  let libNameUpdated = false;

  const updated = lines.map((line) => {
    const sectionMatch = line.match(/^\s*\[(.+)]\s*$/);
    if (sectionMatch) {
      inPackage = sectionMatch[1] === 'package';
      inLib = sectionMatch[1] === 'lib';
    }

    if (inPackage && line.startsWith('name = ')) {
      packageNameUpdated = true;
      return `name = "${packageName}"`;
    }

    if (inPackage && line.startsWith('authors = ')) {
      authorsUpdated = true;
      return `authors = [${authors.map((author) => `"${author}"`).join(', ')}]`;
    }

    if (inLib && line.startsWith('name = ')) {
      libNameUpdated = true;
      return `name = "${libName}"`;
    }

    return line;
  });

  if (!packageNameUpdated || !authorsUpdated || !libNameUpdated) {
    throw new Error(`Failed to update Cargo.toml at ${filePath}`);
  }

  await writeFile(filePath, `${updated.join('\n')}\n`, 'utf8');
}

async function updateMainRs(
  filePath: string,
  oldLibName: string,
  newLibName: string,
): Promise<void> {
  const original = await readFile(filePath, 'utf8');
  const expected = `${oldLibName}::run()`;
  const replacement = `${newLibName}::run()`;
  if (!original.includes(expected)) {
    throw new Error(`Cannot find expected Rust entry call in ${filePath}`);
  }
  await writeFile(filePath, original.replace(expected, replacement), 'utf8');
}

async function updateTextFile(
  filePath: string,
  from: string,
  to: string,
): Promise<void> {
  const original = await readFile(filePath, 'utf8');
  if (!original.includes(from)) {
    throw new Error(`Cannot find expected text in ${filePath}`);
  }
  await writeFile(filePath, original.replace(from, to), 'utf8');
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const projectName = assertNonEmpty(args.name, 'project name');
  const identifier = assertNonEmpty(args.id, 'identifier');
  const packageName = toValidPkgName(projectName);
  const workspacePackageName = toKebabPackageName(projectName);

  const context = await locateAppContext();
  const currentProjectName = path.basename(context.appDir);
  const currentConfig = await readJson<{
    productName: string;
    identifier: string;
    app: { windows: Array<{ title?: string }> };
  }>(context.tauriConfigPath);
  const currentCargo = await readFile(context.cargoTomlPath, 'utf8');
  const currentLibNameMatch = currentCargo.match(
    /\[lib\][\s\S]*?^\s*name = "([^"]+)"\s*$/m,
  );
  if (!currentLibNameMatch) {
    throw new Error(
      `Cannot read current Rust lib name from ${context.cargoTomlPath}`,
    );
  }
  const currentLibName = currentLibNameMatch[1];

  const newAppDir = path.join(
    path.dirname(context.appDir),
    workspacePackageName,
  );
  const newAppPackageName = `@app/${workspacePackageName}`;
  const newLibName = toRustLibName(packageName);
  const targetExists = await stat(newAppDir)
    .then(() => true)
    .catch(() => false);

  if (targetExists && newAppDir !== context.appDir) {
    throw new Error(`Target app directory already exists: ${newAppDir}`);
  }

  await writeJson(context.appPackagePath, {
    ...context.appPackage,
    name: newAppPackageName,
  });

  await writeJson(context.rootPackagePath, {
    ...context.rootPackage,
    scripts: {
      ...context.rootPackage.scripts,
      dev: `pnpm --filter ${newAppPackageName} dev`,
      build: `pnpm --filter ${newAppPackageName} build`,
      preview: `pnpm --filter ${newAppPackageName} preview`,
      tauri: `pnpm --filter ${newAppPackageName} tauri`,
    },
  });

  await writeJson(context.tauriConfigPath, {
    ...currentConfig,
    productName: projectName,
    identifier,
    app: {
      ...currentConfig.app,
      windows: currentConfig.app.windows.map((window, index) =>
        index === 0 ? { ...window, title: projectName } : window,
      ),
    },
  });

  await updateCargoToml(
    context.cargoTomlPath,
    packageName,
    ['example'],
    newLibName,
  );
  await updateMainRs(context.mainRsPath, currentLibName, newLibName);
  await updateTextFile(
    context.appReadmePath,
    `apps/${currentProjectName}`,
    `apps/${workspacePackageName}`,
  );

  if (context.appDir !== newAppDir) {
    await rename(context.appDir, newAppDir);
  }

  console.log(
    JSON.stringify(
      {
        projectName,
        packageName,
        workspacePackageName,
        identifier,
        appDir: newAppDir,
        package: newAppPackageName,
        lib: newLibName,
      },
      null,
      2,
    ),
  );
}

void main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`royrao: ${message}`);
  process.exit(1);
});

import { z } from 'zod'

export enum ModLoaderName {
  fabric = 'fabric',
  forge = 'forge',
  none = 'none',
}

export enum ShaderpackLoaderName {
  iris = 'iris',
  optifine = 'optifine',
  none = 'none',
}

export const minecraftLoginResponse = z.object({
  username: z.string(),
  roles: z.array(z.string()),
  access_token: z.string(),
  token_type: z.string(),
  expires_in: z.number(),
})

export const minecraftProfileState = z.enum(['ACTIVE', 'INACTIVE'])
export const minecraftSkinVariant = z.enum(['CLASSIC', 'SLIM'])

export const minecraftSkin = z.object({
  id: z.string(),
  state: minecraftProfileState,
  url: z.string(),
  variant: minecraftSkinVariant,
})

export const minecraftCape = z.object({
  id: z.string(),
  state: minecraftProfileState,
  url: z.string(),
  alias: z.string(),
})

export const minecraftProfile = z.object({
  id: z.string(),
  name: z.string(),
  skins: z.array(minecraftSkin),
  capes: z.array(minecraftCape),
})

export const modrinthProjectVersion = z.object({
  game_versions: z.array(z.string()),
  loaders: z.array(z.string()),
  id: z.string(),
  project_id: z.string(),
  author_id: z.string(),
  featured: z.boolean(),
  name: z.string(),
  version_number: z.string(),
  changelog: z.string(),
  changelog_url: z.string().nullable(),
  date_published: z.string(),
  downloads: z.number(),
  version_type: z.string(),
  status: z.string(),
  requested_status: z.string().nullable(),
  files: z.array(
    z.object({
      hashes: z.record(z.string(), z.string()),
      url: z.string(),
      filename: z.string(),
      primary: z.boolean(),
      size: z.number(),
      file_type: z.string().nullable(),
    })
  ),
  dependencies: z.array(
    z.object({
      version_id: z.string().nullable(),
      project_id: z.string(),
      file_name: z.string().nullable(),
      dependency_type: z.string(),
    })
  ),
})

export const mojangVersionManifest = z.object({
  id: z.string(),
  type: z.string(),
  url: z.string(),
  time: z.string(),
  releaseTime: z.string(),
})

export const mojangVersionManifests = z.object({
  latest: z.object({
    release: z.string(),
    snapshot: z.string(),
  }),
  versions: z.array(mojangVersionManifest),
})

export const mojangRule = z.object({
  action: z.string(),
  features: z.optional(z.record(z.string(), z.boolean())),
  os: z.optional(
    z.object({
      arch: z.optional(z.string()),
      name: z.optional(z.string()),
    })
  ),
})

export const mojangStringsTemplate = z.array(
  z.union([
    z.string(),
    z.object({
      rules: z.array(mojangRule),
      value: z.union([z.string(), z.array(z.string())]),
    }),
  ])
)

export const mojangHash = z.object({
  sha1: z.string(),
  size: z.number(),
  url: z.string(),
})

export const mojangArtifact = mojangHash.extend({
  path: z.string(),
})

export const mojangLibrary = z.object({
  downloads: z.object({
    artifact: mojangArtifact,
  }),
  name: z.string(),
  rules: z.optional(z.array(mojangRule)),
})

export const mojangVersionDetails = z.object({
  arguments: z.object({
    game: mojangStringsTemplate,
    jvm: mojangStringsTemplate,
  }),
  assetIndex: mojangHash.extend({
    id: z.string(),
    totalSize: z.number(),
  }),
  assets: z.string(),
  complianceLevel: z.number(),
  downloads: z.record(z.string(), mojangHash),
  id: z.string(),
  javaVersion: z.object({
    component: z.string(),
    majorVersion: z.number(),
  }),
  libraries: z.array(mojangLibrary),
  logging: z.object({
    client: z.object({
      argument: z.string(),
      file: mojangHash.extend({ id: z.string() }),
      type: z.string(),
    }),
  }),
  mainClass: z.string(),
  minimumLauncherVersion: z.number(),
  releaseTime: z.string(),
  time: z.string(),
  type: z.string(),
})

export const fabricVersionDetails = z.object({
  id: z.string(),
  inheritsFrom: z.string(),
  releaseTime: z.string(),
  time: z.string(),
  type: z.string(),
  mainClass: z.string(),
  arguments: z.object({
    game: z.array(z.string()),
    jvm: z.array(z.string()),
  }),
  libraries: z.array(
    z.object({
      name: z.string(),
      url: z.string(),
      sha1: z.optional(z.string()),
      size: z.optional(z.number()),
    })
  ),
})

export const xboxLiveProfile = z.object({
  profileUsers: z.array(
    z.object({
      id: z.string(),
      hostId: z.optional(z.string()).nullable(),
      settings: z.array(
        z.object({
          id: z.string(),
          value: z.string(),
        })
      ),
      isSponsoredUser: z.boolean(),
    })
  ),
})

export const xstsAuthorizeResponse = z.object({
  IssueInstant: z.string(),
  NotAfter: z.string(),
  Token: z.string(),
  DisplayClaims: z.object({
    xui: z.array(
      z.object({
        gtg: z.optional(z.string()),
        uhs: z.string(),
        xid: z.optional(z.string()),
      })
    ),
  }),
})

export const gameAccount = z.object({
  active: z.boolean(),
  profile: minecraftProfile,
  userToken: xstsAuthorizeResponse,
  xboxliveToken: xstsAuthorizeResponse,
  minecraftToken: xstsAuthorizeResponse,
  yggdrasilToken: minecraftLoginResponse,
})

export const gameAnalyticsPattern = z.object({
  name: z.string(),
  pattern: z
    .union([z.string(), z.instanceof(RegExp)])
    .transform((x) => new RegExp(x)),
  usernameIndex: z.number().optional(),
  valueIndex: z.number().optional(),
})

export const gameMod = z.object({
  name: z.string(),
  url: z.string(),
  extraFiles: z.optional(z.record(z.string(), z.string())),
})

export const gameShaderpack = z.object({
  name: z.string(),
  url: z.string(),
})

export const gameInstall = z.object({
  name: z.string(),
  path: z.string(),
  uuid: z.string(),
  versionManifest: mojangVersionManifest,
  extraCommandlineArguments: z.optional(z.array(z.string())),
  fabricLoaderVersion: z.optional(z.string()),
  iconHash: z.optional(z.string()),
  mods: z.optional(z.array(gameMod)),
  shaderpacks: z.optional(z.array(gameShaderpack)),
  wrapMainClass: z.optional(z.boolean()),
})

export const waypoint = z.object({
  name: z.string(),
  date: z.coerce.date(),
  x: z.number(),
  y: z.number(),
  z: z.number(),
})

export type MinecraftLoginResponse = z.infer<typeof minecraftLoginResponse>
export type MinecraftProfile = z.infer<typeof minecraftProfile>
export type MinecraftProfileState = z.infer<typeof minecraftProfileState>
export type ModrinthProjectVersion = z.infer<typeof modrinthProjectVersion>
export type MojangLibrary = z.infer<typeof mojangLibrary>
export type MojangRule = z.infer<typeof mojangRule>
export type MojangVersionDetails = z.infer<typeof mojangVersionDetails>
export type MojangVersionManifest = z.infer<typeof mojangVersionManifest>
export type MojangVersionManifests = z.infer<typeof mojangVersionManifests>
export type MojangStringsTemplate = z.infer<typeof mojangStringsTemplate>
export type XSTSAuthorizeResponse = z.infer<typeof xstsAuthorizeResponse>

export type GameAccount = z.infer<typeof gameAccount>
export type GameAnalyticsPattern = z.infer<typeof gameAnalyticsPattern>
export type GameInstall = z.infer<typeof gameInstall>
export type GameMod = z.infer<typeof gameMod>
export type GameShaderpack = z.infer<typeof gameShaderpack>
export type Waypoint = z.infer<typeof waypoint>

export const STORE_KEYS = {
  gameAnalyticsPatterns: 'gameAnalyticsPatterns',
  gameAccounts: 'gameAccounts',
  gameInstalls: 'gameInstalls',
  gameLogDirectories: 'gameLogDirectories',
  waypoints: 'waypoints',
}

export const QUERY_KEYS = {
  useGameAccounts: 'useGameAccounts',
  useGameAnalyticsPatterns: 'useGameAnalyticsPatterns',
  useGameInstalls: 'useGameInstalls',
  useGameLogDirectories: 'useGameLogDirectories',
  useModrinthProjectVersion: 'useModrinthProjectVersion',
  useMojangVersionManifests: 'useMojangVersionManifests',
  useWaypoints: 'useWaypoints',
}

export const CHANNELS = {
  clipboardTextUpdated: 'clipboard-text-updated',
  createGameInstall: 'create-game-install',
  deleteGameInstall: 'delete-game-install',
  electronStoreGet: 'electron-store-get',
  electronStoreSet: 'electron-store-set',
  launchGameInstall: 'launch-game-install',
  loginToMicrosoftAccount: 'login-to-microsoft-account',
  openBrowserWindow: 'open-browser-window',
  openFileDialog: 'open-file-dialog',
  getLogfilePath: 'get-logfile-path',
  readGameLogs: 'read-game-logs',
}

export const LAUNCH_STATUS = {
  finished: 'finished',
}

export const LAUNCH_CHANNEL = (uuid: string) => `launch-game-install-${uuid}`

export const findVersionManifest = (
  versionManifests: MojangVersionManifests | undefined,
  version: string
) => versionManifests?.versions?.find((x) => x.id === version)

export const getGameInstalModLoaderName = (
  gameInstall: Partial<GameInstall>
): ModLoaderName => {
  if (gameInstall.fabricLoaderVersion) return ModLoaderName.fabric
  return ModLoaderName.none
}

export const getGameInstalShaderpackLoaderName = (
  gameInstall: Partial<GameInstall>
): ShaderpackLoaderName => {
  for (const shaderpack of gameInstall.shaderpacks ?? []) {
    if (shaderpack.name === ShaderpackLoaderName.iris)
      return ShaderpackLoaderName.iris
    if (shaderpack.name === ShaderpackLoaderName.optifine)
      return ShaderpackLoaderName.optifine
  }
  return ShaderpackLoaderName.none
}

export const getGameInstallIsHacked = (gameInstall: Partial<GameInstall>) =>
  gameInstall?.mods?.some((x) => x.name === 'meteor-client')

export const setGameInstallModLoaderName = (
  gameInstall: Partial<GameInstall>,
  modLoaderName: string
): Partial<GameInstall> => {
  switch (modLoaderName) {
    case ModLoaderName.fabric:
      return { ...gameInstall, fabricLoaderVersion: 'auto' }
    default:
      return { ...gameInstall, fabricLoaderVersion: undefined }
  }
}

export const toggleGameInstallMod = (
  gameInstall: Partial<GameInstall>,
  mod: GameMod,
  includeMod?: boolean
): Partial<GameInstall> => ({
  ...gameInstall,
  mods: (
    includeMod !== undefined
      ? includeMod
      : gameInstall.mods?.some((x) => x.name === mod.name)
  )
    ? [...(gameInstall.mods ?? []), mod]
    : (gameInstall.mods ?? []).filter((x) => x.name !== mod.name),
})

export const toggleGameInstallShaderpack = (
  gameInstall: Partial<GameInstall>,
  shaderpack: GameShaderpack,
  includeShaderpack?: boolean
): Partial<GameInstall> => ({
  ...gameInstall,
  shaderpacks: (
    includeShaderpack !== undefined
      ? includeShaderpack
      : gameInstall.shaderpacks?.some((x) => x.name === shaderpack.name)
  )
    ? [...(gameInstall.shaderpacks ?? []), shaderpack]
    : (gameInstall.shaderpacks ?? []).filter((x) => x.name !== shaderpack.name),
})

export const parseLibraryName = (libraryName: string) => {
  const [jarOrg, jarName, jarVersion] = libraryName.split(':')
  return {
    jarOrg,
    jarName,
    jarVersion,
  }
}

export const updateVersionDetailsLibrary = (
  versionDetails: MojangVersionDetails,
  newLibrary: MojangLibrary
) => {
  const { jarOrg: newLibraryJarOrg, jarName: newLibraryJarName } =
    parseLibraryName(newLibrary.name)
  for (let i = 0; i < versionDetails.libraries.length; i++) {
    const library = versionDetails.libraries[i]
    const { jarOrg, jarName } = parseLibraryName(library.name)
    if (jarOrg === newLibraryJarOrg && jarName === newLibraryJarName) {
      versionDetails.libraries[i] = newLibrary
      return
    }
  }
  versionDetails.libraries.push(newLibrary)
}

export const removeProperty = <X extends Record<string, unknown>>(
  x: X,
  key: string
) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [key]: _removed, ...rest } = x
  return rest
}

export type SurfaceCommandName = "version";

export interface SurfaceCommandInput {
  command: SurfaceCommandName;
  value: string;
}

export interface SurfaceCommandResult {
  command: SurfaceCommandName;
  stdout: string;
  exitCode: number;
}

export declare function createSurfaceCommandResult(input: SurfaceCommandInput): SurfaceCommandResult;

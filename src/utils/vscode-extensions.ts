import * as _ from 'lodash';
import * as vscode from 'vscode';
import { IVSIcons, IFileExtension } from '../models';

export function getConfig(): vscode.WorkspaceConfiguration {
  return vscode.workspace.getConfiguration();
}

export function getVsiconsConfig(): IVSIcons {
  const config = vscode.workspace.getConfiguration();
  const mergedConfig = _.cloneDeep(config.vsicons);
  const files = config.inspect<IFileExtension>('vsicons.associations.files');
  const folders = config.inspect<IFileExtension>('vsicons.associations.folders');
  const filesWorkspace: any = files.workspaceValue;
  const filesGlobal: any = files.globalValue;
  if (filesWorkspace && filesGlobal) {
    mergedConfig.associations.files = _.unionWith(
      filesWorkspace,
      filesGlobal,
      _.isEqual,
    );
  }

  if (folders.workspaceValue && folders.globalValue) {
    mergedConfig.associations.folders = _.unionWith(
      filesWorkspace,
      filesGlobal,
      _.isEqual,
    );
  }

  return mergedConfig;
}

export function findFiles(
  include: string,
  exclude: string,
  maxResults?: number,
  token?: vscode.CancellationToken,
) {
  return vscode.workspace.findFiles(include, exclude, maxResults, token);
}

export function asRelativePath(pathOrUri: string | vscode.Uri): string {
  return vscode.workspace.asRelativePath(pathOrUri);
}

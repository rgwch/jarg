export interface RepoConfig {
  url: string;
  password: string;
  dirs?: string[];
}

export interface Snapshot {
  id: string;
  short_id: string;
  time: string;
  hostname: string;
  username?: string;
  paths: string[];
  tags?: string[];
  summary?: {
    total_files_processed: number;
    total_bytes_processed: number;
    total_duration: number;
    files_new?: number;
    files_changed?: number;
  };
}

export interface FileEntry {
  name: string;
  type: 'file' | 'dir' | 'symlink' | 'other';
  path: string;
  uid?: number;
  gid?: number;
  mode?: number;
  permissions?: string;
  mtime?: string;
  atime?: string;
  ctime?: string;
  size?: number;
  struct_type?: string;
}

export interface ResticApiResponse {
  success: boolean;
  stdout?: string;
  stderr?: string;
  error?: string;
}

import type { ElTagType } from '@/types/el-types.ts'

export interface Role {
  id: number
  name: string
  label: string
  type: ElTagType
  createdAt?: string | Date
}

export type UserStatus = 'active' | 'frozen' | 'deactivated' | 'other'

export interface User {
  id?: number
  username: string
  password: string
  avatar?: string
  nickname?: string
  email?: string
  phone?: string
  status?: UserStatus
  roleId?: number
  role?: Role
  registeredAt?: string | Date
}

export enum MenuType {
  MENU = 'menu',
  OPERATION = 'operation',
}

export interface Menu {
  id?: number;
  name: string;
  route: string;
  icon?: string;
  title?: string;
  hidden?: boolean;
  type?: MenuType;
  parentId?: number;
  parent?: Menu;
  children?: Menu[];
  hasChildren?: boolean;
  createdAt?: string;
  deleted?: boolean;
}

export interface RouteRecordEntity {
  name: string;
  path: string;
  component: string;
  meta: {
    title: string;
    icon?: string;
    hidden?: boolean;
  };
}

export interface LoginForm { username: string, password: string }

export interface ChangePassword {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}



export interface Artist {
  id?: number
  name: string
  nickname?: string
  cover?: string
  genre?: string
  bio?: string
  albums?: Album[]
  createdAt?: string | Date
}

export enum AlbumType {
  Album = 'album',
  EP = 'ep',
  Single = 'single',
  Compilation = 'compilation',
  Live = 'live',
  Other = 'other'
}

export interface Album {
  id?: number;
  title: string;
  cover?: string;
  genre?: string;
  releaseDate?: string | Date
  totalDiscs?: number
  totalTracks?: number
  duration?: number
  bio?: string
  type?: AlbumType
  artist?: Artist[]
  artistNames?: string
  song?: Song[]
  createdAt?: string | Date
}

export interface Song {
  id?: number;
  discNumber?: number;
  trackNumber?: number;
  title: string;
  cover?: string;
  genre?: string;
  releaseDate?: string | Date
  lyric?: string
  duration?: number
  bio?: string
  album?: Album
  artists?: Artist[]
  artistNames?: string
  albumName?: string
  createdAt?: string | Date
}

export interface Post {
  id?: number
  title: string
  content: string
  author?: User
  authorId?: number
  publishedAt?: string | Date
}

export interface Comment {
  id?: number
  content: string
  repliedId?: number
  repliedPost?: Post
  repliedComment?: Comment
  author?: User
  authorId?: number
  publishedAt?: string | Date
}

export interface Shared {
  id?: number
}

export enum TargetType {
  Post = 'post',
  Comment = 'comment',
  Shared = 'shared'
}

export enum FeedbackStatus {
  Pending = 'pending',
  Processing = 'processing',
  Resolved = 'resolved',
  Rejected = 'rejected',
  Closed = 'closed'
}

export interface Audit {
  id?: number
  reason: string
  targetId?: number
  targetType?: TargetType
  target?: Post | Comment// | Shared
  submitterId?: number
  submitter?: User
  auditorId?: number
  auditor?: User
  status?: FeedbackStatus
  createdAt?: string | Date
}

export interface AuditProcess {
  newStatus: FeedbackStatus
}

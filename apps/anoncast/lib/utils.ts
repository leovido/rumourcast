import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const DELETE_ACTION_ID = 'dacf512a-b535-49b5-be40-cb70226fdaab'
export const PROMOTE_ACTION_ID = '541820ba-9767-4533-a248-eacb5c3e371c'
export const LAUNCH_ACTION_ID = ''
export const CREATE_ACTION_ID = '4de8ac8d-b90c-4926-98cd-123925736145'

export const TICKER = 'RUMOUR'
export const TOKEN_ADDRESS = '0x1ceccbe4d3a19cb62dbbd09756a52cfe5394fab8'
export const POST_AMOUNT = '10000000000000000000000000'
export const LAUNCH_AMOUNT = '100000000000000000000000000'
export const PROMOTE_AMOUNT = '100000000000000000000000000'
export const DELETE_AMOUNT = '100000000000000000000000000'
export const FARC_USERNAME = 'rumour'
export const FID = 884230
export const BEST_OF_FID = 884230
export const LAUNCH_FID = 884230

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

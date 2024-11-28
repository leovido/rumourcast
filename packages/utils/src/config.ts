export const ANON_ADDRESS =
  "0x1CEcCbE4d3a19cB62DbBd09756A52Cfe5394Fab8".toLowerCase();
export const COMMENT_ADDRESS = "0x0000000000000000000000000000000000000000";

export const TOKEN_CONFIG: Record<
  string,
  {
    ticker: string;
    postAmount: string;
    promoteAmount: string;
    deleteAmount: string;
    farcasterUsername: string;
    fid: number;
  }
> = {
  [ANON_ADDRESS]: {
    ticker: "RUMOUR",
    postAmount: "5000000000000000000000",
    promoteAmount: "2000000000000000000000000",
    deleteAmount: "2000000000000000000000000",
    farcasterUsername: "rumourcast",
    fid: 884230,
  },
  [COMMENT_ADDRESS]: {
    ticker: "COMMENT",
    postAmount: "1",
    promoteAmount: "1",
    deleteAmount: "1",
    farcasterUsername: "comment",
    fid: 884230,
  },
};

export const USERNAME_TO_ADDRESS: Record<string, string> = Object.entries(
  TOKEN_CONFIG
).reduce((acc, [address, { farcasterUsername }]) => {
  acc[farcasterUsername] = address;
  return acc;
}, {} as Record<string, string>);

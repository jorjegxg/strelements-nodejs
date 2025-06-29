export type ConnectionToPlatform = {
  app_user_id: string;
  platform_user_id: number;
};
export enum NameOfPlatform {
  KICK = "kick",
  TWITCH = "twitch",
  YOUTUBE = "youtube",
}

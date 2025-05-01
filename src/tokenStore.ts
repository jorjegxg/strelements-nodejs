export let tokens = {
  access_token: "",
  refresh_token: "",
  expires_at: 0,
};

export function saveTokens(newTokens: typeof tokens) {
  tokens = newTokens;
}

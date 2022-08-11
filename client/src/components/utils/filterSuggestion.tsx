import { GetSuggestion } from "../../graphql/types";
interface Profile {
  followed: {
    username: string;
    following: boolean;
  }[];
  following: boolean;
  username: string;
  image: string;
}
export default (data: GetSuggestion) => {
  if (!data || !data.getSuggestion.profiles) return [];

  const result = data.getSuggestion.profiles
    .map((item) => {
      return {
        ...item,
        followed: item.followed.filter((user) => user.following),
      };
    })
    .filter((item) => item.followed.length > 1)
    .sort((a: Profile, b: Profile) => b.followed.length - a.followed.length)
    .slice(0, 5);
  return result;
};

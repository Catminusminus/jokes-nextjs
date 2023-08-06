import { atom, useRecoilValue, useSetRecoilState } from "recoil";
import { randomLoader } from "./loader";

const randomJokeState = atom<Awaited<ReturnType<typeof randomLoader>> | null>({
  key: "randomJoke",
  default: null,
});

export const useRandomJoke = () => {
  const randomJoke = useRecoilValue(randomJokeState);
  return randomJoke;
};

export const useSetRandomJoke = () => {
  const setRandomJoke = useSetRecoilState(randomJokeState);
  return setRandomJoke;
};

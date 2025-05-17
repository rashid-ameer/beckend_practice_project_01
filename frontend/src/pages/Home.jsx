import { useOutletContext } from "react-router";

function Home() {
  const u = useOutletContext();

  return <div>{JSON.stringify(u)}</div>;
}
export default Home;

import { Banner } from "../components/banner";
import FaqAccordion from "../components/FaqAccordion";

function Home() {
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen flex flex-col items-center w-full overflow-x-hidden">
      <Banner />
      <FaqAccordion />
    </div>
  );
}

export default Home;
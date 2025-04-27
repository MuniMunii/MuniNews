import "../../root.css";
import IndexScreen from "../component/index/indexscreen";
import FooterComp from "../component/footer";
import  {Helmet} from "react-helmet";
function Index() {
  return (
    <>
    <Helmet>
          <title>MuniNews</title>
    </Helmet>
      <div
        className={`w-full h-full`}
      >
        <IndexScreen />
      </div>
      <FooterComp/>
    </>
  );
}
export default Index;

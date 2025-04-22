import "../../root.css";
import IndexScreen from "../component/index/indexscreen";
import FooterComp from "../component/footer";
function Index() {
  return (
    <>
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

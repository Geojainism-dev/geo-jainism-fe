import Navbar from "@/components/layout/Navbar";
import AtlasMapPage from "./AtlasMapPage";

export default function AtlasPage() {
  return (
    <div className="atlas-root" data-theme="light">
      <Navbar />
      <AtlasMapPage />
    </div>
  );
}

import Layout from "./component/Layout.tsx";
import {Navigate, Route, Routes} from "react-router-dom";
import TenantCreate from "./pages/tenants/TenantCreate.tsx";
import TenantList from "./pages/tenants/TenantList.tsx";
import TenantDetails from "./pages/tenants/TenantDetails.tsx";
import TenantEdit from "./pages/tenants/TenantEdit.tsx";

function App() {


  return (
    <>
<Layout>
    <Routes>
        <Route path="/" element={<Navigate to="/tenants" replace />} />
        <Route path="/tenants/create" element={<TenantCreate />} />
        <Route path="/tenants" element={<TenantList />} />
        <Route path="/tenants/:tenantId" element={<TenantDetails />} />
        <Route path="/tenants/:tenantId/edit" element={<TenantEdit />} />
    </Routes>
</Layout>


    </>
  )
}

export default App

import React, { Fragment, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DefaultLayout } from "~/layout";
import { Container } from "react-bootstrap";
import PrivateRoutes from "~/Route/PrivateRoutes";
import PublicRoutes from "~/Route/PublicRoutes";
import { adminRoutes, privateRoutes, publicRoutes } from "~/Route/Routes";
import Layout from "./layout/layout";
import requestApi from "./utils/api";
import AdminRoutes from "./Route/AdminRoutes";
import AdminLayout from "./layout/AdminLayout";
function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route element={<Layout />}>
            <Route element={<PrivateRoutes />}>
              {privateRoutes.map((route, index) => {
                const Page = route.component;
                let Layout = DefaultLayout;
                if (route.layout) {
                  Layout = route.layout;
                } else if (route.layout === null) {
                  Layout = Fragment;
                }
                return (
                  <Route
                    key={index}
                    path={route.path}
                    element={
                      <Layout>
                        {!route.isNotNeedContainer ? (
                          <Container style={{ minWidth: "85%" }}>
                            <Page />
                          </Container>
                        ) : (
                          <Page />
                        )}
                      </Layout>
                    }
                  />
                );
              })}
            </Route>
            <Route element={<Layout />}>
              {publicRoutes.map((route, index) => {
                const Page = route.component;
                let Layout = DefaultLayout;
                if (route.layout) {
                  Layout = route.layout;
                } else if (route.layout === null) {
                  Layout = DefaultLayout;
                }
                return (
                  <Route
                    key={index}
                    path={route.path}
                    element={
                      <Layout>
                        <Container style={{ minWidth: "85%" }}>
                          <Page />
                        </Container>
                      </Layout>
                    }
                  />
                );
              })}
            </Route>
            <Route element={<AdminRoutes />}>
              {adminRoutes.map((route, index) => {
                const Page = route.component;
                let Layout = AdminLayout;
                if (route.layout) {
                  Layout = route.layout;
                } else if (route.layout === null) {
                  Layout = Fragment;
                }
                return (
                  <Route
                    key={index}
                    path={route.path}
                    element={
                      <Layout>
                        <Container style={{ minWidth: "85%" }}>
                          <Page />
                        </Container>
                      </Layout>
                    }
                  />
                );
              })}
            </Route>
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;

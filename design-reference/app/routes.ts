import { createBrowserRouter } from "react-router";
import Root from "./pages/root";
import HomePage from "./pages/home";
import BrowsePage from "./pages/browse";
import SkillDetailPage from "./pages/skill-detail";
import ProfilePage from "./pages/profile-enhanced";
import SubmitPage from "./pages/submit";
import AuthPage from "./pages/auth";
import CommunityPage from "./pages/community-unified";
import CollectionDetailPage from "./pages/collection-detail";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: HomePage },
      { path: "browse", Component: BrowsePage },
      { path: "skill/:skillId", Component: SkillDetailPage },
      { path: "profile/:userId", Component: ProfilePage },
      { path: "submit", Component: SubmitPage },
      { path: "auth", Component: AuthPage },
      { path: "community", Component: CommunityPage },
      { path: "collection/:collectionId", Component: CollectionDetailPage },
    ],
  },
]);
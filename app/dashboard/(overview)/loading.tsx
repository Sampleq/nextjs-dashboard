// loading.tsx is a special Next.js file built on top of React Suspense. It allows you to create fallback UI to show as a replacement while page content loads.
// Since <SideNav> (in layout.tsx) is static, it's shown immediately. The user can interact with <SideNav> while the dynamic content is loading.

// A loading skeleton is a simplified version of the UI. Many websites use them as a placeholder (or fallback) to indicate to users that the content is loading. Any UI you add in loading.tsx will be embedded as part of the static file, and sent first. Then, the rest of the dynamic content will be streamed from the server to the client.
import DashboardSkeleton from '@/app/ui/skeletons';

function Loading() {
  return (
    <>
      {/* <h1>Loading...</h1> */}
      <DashboardSkeleton />
    </>
  );
}

export default Loading;

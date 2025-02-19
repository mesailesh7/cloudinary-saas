import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';


//All the routes that are public and can be accessed without login
const isPublicRoute = createRouteMatcher([
    "/signin",
    "/signup",
    "/",
    "/home"
])

const isPublicApiRoute = createRouteMatcher([
    "/api/videos"
])

export default clerkMiddleware(async (auth, req) => {
    const { userId } = await auth();
    const currentUrl = new URL(req.url);
    const isAccessingDashboard = currentUrl.pathname === "/home";
    const isApiRequest = currentUrl.pathname.startsWith("/api");

    // Add your middleware logic here
    //if user is logged in and accessing a public route but not dashboard
    if (userId && isPublicRoute(req) && !isAccessingDashboard) {
        return NextResponse.redirect(new URL("/home", req.url));
    }

    // if not logged in
    if (!userId) {
        //if user is not logged in and trying to access a protected route
        if (isPublicApiRoute(req) && !isPublicApiRoute(req)) {
            return NextResponse.redirect(new URL("/signin", req.url))
        }


        //if the request is for a protected API and the user is not logged in
        if (isApiRequest && !isPublicApiRoute(req)) {
            return NextResponse.redirect(new URL("/signin", req.url))
        }
    }

    //In middleware it is very important because it needs to execute in between and transfer the request to wherever it needs to go
    return NextResponse.next();


});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}
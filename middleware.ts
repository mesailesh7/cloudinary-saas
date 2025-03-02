// import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
// import { NextResponse } from 'next/server';


// //All the routes that are public and can be accessed without login
// const isPublicRoute = createRouteMatcher([
//     "/sign-in",
//     "/sign-up",
//     "/",
//     "/home"
// ])

// const isPublicApiRoute = createRouteMatcher([
//     "/api/videos"
// ])

// export default clerkMiddleware(async (auth, req) => {
//     const { userId } = await auth();
//     const currentUrl = new URL(req.url);
//     const isAccessingDashboard = currentUrl.pathname === "/home";
//     const isApiRequest = currentUrl.pathname.startsWith("/api");

//     // Add your middleware logic here
//     //if user is logged in and accessing a public route but not dashboard
//     if (userId && isPublicRoute(req) && !isAccessingDashboard) {
//         return NextResponse.redirect(new URL("/home", req.url));
//     }

//     // if not logged in
//     if (!userId) {
//         //if user is not logged in and trying to access a protected route
//         if (isPublicRoute(req) && !isPublicApiRoute(req)) {
//             return NextResponse.redirect(new URL("/sign-in", req.url))
//         }


//         //if the request is for a protected API and the user is not logged in
//         if (isApiRequest && !isPublicApiRoute(req)) {
//             return NextResponse.redirect(new URL("/sign-in", req.url))
//         }
//     }

//     //In middleware it is very important because it needs to execute in between and transfer the request to wherever it needs to go
//     return NextResponse.next();
// });

// export const config = {
//     matcher: [
//         // Skip Next.js internals and all static files, unless found in search params
//         "/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)",
//     ],
// }



import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { url } from "inspector";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
    "/sign-in",
    "/sign-up",
    "/",
    "/home"
])

const isPublicApiRoute = createRouteMatcher([
    "/api/videos"
])


export default clerkMiddleware((auth, req) => {
    const { userId } = auth();
    const currentUrl = new URL(req.url);
    const isAccessingDashboard = currentUrl.pathname === "/home"
    const isApiRequest = currentUrl.pathname.startsWith("/api")


    if (userId && isPublicRoute(req) && !isAccessingDashboard) {
        return NextResponse.redirect(new URL("/home", req.url));
    }

    if (!userId) {
        if (!isPublicApiRoute(req) && !isPublicRoute(req)) {
            return NextResponse.redirect(new URL("/sign-in", req.url))
        }

        if (isApiRequest && !isPublicApiRoute(req)) {
            return NextResponse.redirect(new URL("/sign-in", req.url))
        }
    }
    return NextResponse.next()
})


export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        "/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)",
    ],
}


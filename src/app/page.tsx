import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import { Spotlight } from "@/components/ui/spotlight";
import getServerSession from "@/lib/get-server-session";
import { IconBrandGoogle } from "@tabler/icons-react";
import { redirect } from "next/navigation";


export default async function LandingPage() {
  const session = await getServerSession()
  if (session?.user) {
    redirect('/dashboard')
  }
  return (
    <div className="h-screen w-full rounded-md flex md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      <div className=" p-4 max-w-7xl  mx-auto relative z-10  w-full pt-20 md:pt-0 flex flex-col items-center">
        <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
          Spotlight <br /> is the new trend.
        </h1>
        <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
          Join Spotlight, where your thoughts are the star of the show! Share quick
          updates, trending moments, and everyday highlights with a community that&apos;s
          always in the know. Whether it&apos;s the latest movie, series, or just a thought,
          Spotlight is the place to shine.
        </p>
        <form action={async () => {
          "use server"
          await signIn("google", { redirectTo: "/dashboard" })
        }}>
          <Button className=" mt-8 flex justify-center items-center">
            <IconBrandGoogle className="mr-2 h-4 w-4" /> Shine Now
          </Button>
        </form>
      </div>
    </div>
  );
}



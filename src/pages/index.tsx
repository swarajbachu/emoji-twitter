import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { api } from "(~/)/utils/api";
import { SignIn, SignInButton, SignOutButton, SignUpButton, useUser } from "@clerk/nextjs";

const Home: NextPage = () => {
  const user = useUser();
  const {data}  = api.posts.getAll.useQuery();



  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-white">
      <div>
        {user.isSignedIn ? <SignInButton /> : <SignOutButton />}
      </div>
      {data?.map((post) => (
      <div key={post.id}>
        <div>
          {post.content}
        </div>
      </div>
      ))}

      </main>
    </>
  );
};

export default Home;

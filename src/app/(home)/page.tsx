import TodoKanban from "@/components/TodoKanban";

export default function Home() {
  return (
    <div className="flex flex-col w-full items-center justify-items-center min-h-screen p-8">
      <main className="flex w-full 2xl:w-[80%] mx-auto">
        <TodoKanban />
      </main>
    </div>
  );
}

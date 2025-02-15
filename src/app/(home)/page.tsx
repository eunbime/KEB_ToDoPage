import TodoList from "@/components/TodoList";

export default function Home() {
  return (
    <div className="flex flex-col w-full items-center justify-items-center min-h-screen p-8">
      <main className="flex gap-10 w-[80%] mx-auto">
        <TodoList title="todo" />
        <TodoList title="inProgress" />
        <TodoList title="done" />
      </main>
    </div>
  );
}

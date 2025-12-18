export default function DashboardHeader({ userName }) {
  return (
    <div>
      <h1 className="text-3xl font-bold md:text-4xl">My Dashboard</h1>
      <p className="text-muted-foreground mt-2">
        Welcome back, {userName}
      </p>
    </div>
  );
}

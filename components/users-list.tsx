import { User } from "./user";

export const UsersList = ({
  data,
}: {
  data: { userId: string; userName: string }[];
}) => {
  return (
    <div className="bg-white p-10 rounded-3xl">
      <h1 className="font-semibold text-lg">Hosts</h1>
      <div className="grid grid-cols-5 py-5 gap-5">
        {data.map((item) => (
          <User key={item.userId} props={item} />
        ))}
      </div>
    </div>
  );
};

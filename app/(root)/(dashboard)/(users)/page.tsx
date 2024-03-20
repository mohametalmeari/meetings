"use client";

import { UsersList } from "@/components/users-list";
import axios from "axios";
import { useEffect, useState } from "react";

const Page = () => {
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get("/api/users");
      setData(response.data);
    };
    fetchUsers();
  }, []);
  return (
    <div>
      <UsersList data={data} />
    </div>
  );
};

export default Page;

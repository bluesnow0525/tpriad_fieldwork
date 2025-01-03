import React, { useEffect, useState } from "react";
import PaginationComponent from "../../component/Pagination";
import { useAuth } from "../../contexts/AuthContext";
import { url } from "../../assets/url";

function SystemManagementChangeLog() {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const today = new Date().toISOString().split("T")[0];
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    sflag: "",
    slaccount: "",
    startDate: today,
    endDate: today,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch API 數據，將篩選條件傳送到後端
  const fetchData = () => {
    setLoading(true);
    fetch(`${url}/systemlog/read`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...filters,
        pid: user?.pid, // 添加 pid
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 403) {
            alert("您沒有權限查看此資料");
          }
          throw new Error(errorData.error || "查詢發生錯誤");
        }
        return response.json();
      })
      .then((jsonData) => {
        setData(jsonData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error.message);
        alert(error.message || "讀取資料發生錯誤，請稍後再試");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [user?.pid]); // 添加 user?.pid 依賴

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchData();
  };

  // 計算分頁數據
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
        </div>
      )}
      <div className="bg-white p-4 rounded-md shadow-md mb-4">
        <h2 className="text-xl font-semibold mb-4">
          系統管理 &gt; 系統異動紀錄
        </h2>
        <form onSubmit={handleSubmit} className="flex items-center gap-4 mb-4">
          <select
            name="sflag"
            value={filters.sflag}
            onChange={handleFilterChange}
            className="p-2 border rounded w-48"
          >
            <option value="">全部異動狀態</option>
            <option value="編輯">編輯</option>
            <option value="登入">登入</option>
            <option value="新增">新增</option>
            <option value="刪除">刪除</option>
          </select>

          <input
            type="text"
            name="slaccount"
            placeholder="帳號"
            value={filters.slaccount}
            onChange={handleFilterChange}
            className="p-2 border rounded w-48"
          />

          <img
            src="/Images/show-calendar.gif"
            alt="calendar"
            className="h-8 w-8"
          />
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            className="p-2 border rounded w-48"
          />

          <span className="mx-2">~</span>

          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            className="p-2 border rounded w-48"
          />

          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded shadow flex"
          >
            <img
              src="/Images/icon-search.png"
              alt="calendar"
              className="h-5 w-5 mr-1"
            />
            查詢
          </button>
        </form>
      </div>

      <PaginationComponent
        currentPage={currentPage}
        totalPages={Math.ceil(data.length / itemsPerPage)}
        setCurrentPage={setCurrentPage}
        totalItems={data.length}
      />

      <div className="bg-white rounded-md shadow-md p-4 overflow-x-auto mt-4">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 border">異動狀態</th>
              <th className="p-3 border">使用者帳號</th>
              <th className="p-3 border">使用功能</th>
              <th className="p-3 border">內容</th>
              <th className="p-3 border">異動時間</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item) => (
              <tr key={item.slid} className="hover:bg-gray-100 border-t">
                <td className="p-3 ">{item.sflag}</td>
                <td className="p-3 ">{item.slaccount}</td>
                <td className="p-3 ">{item.sname}</td>
                <td className="p-3  text-blue-700">{item.slevent}</td>
                <td className="p-3 ">{item.sodate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SystemManagementChangeLog;

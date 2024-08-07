import React, { useCallback, useEffect, useState } from "react";
import { JewelryWaitSingle } from "./JewelryWaitSingle";
import { User } from "../../../../models/User";
import { PaginationControl } from "react-bootstrap-pagination-control";
import { getRequestByRoleOfSender } from "../../../../api/RequestApprovalAPI";
import { RequestApproval } from "../../../../models/RequestApproval";
import { Spinner, ToastContainer } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useDebouncedCallback } from "use-debounce";
import { useCategories } from "../../../../hooks/useCategories";

interface JewelriesWaitListProps {
  user: User | null;
  setUser: (user: User) => void;
  listNumber: number;
}

const JewelriesWaitList: React.FC<JewelriesWaitListProps> = (props) => {
  const [listRequests, setListRequests] = useState<RequestApproval[]>([]);
  const [user, setUser] = useState<User | null>(props.user);
  const [page, setPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [notification, setNotification] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation(["Staff"]);
  const [debouncedTxtSearch, setDebouncedTxtSearch] = useState("");
  const [txtSearch, setTxtSearch] = useState("");
  const [category, setCategory] = useState("Tất cả");
  const categories = useCategories();
  const categoryNames: (string | undefined)[] = categories.map(
    (category) => category.name
  );
  categoryNames.unshift("Tất cả");

  const debouncedTxtSearchChange = useDebouncedCallback((txtSearch: string) => {
    setDebouncedTxtSearch(txtSearch);
  }, 1000);

  const handleTxtSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTxtSearch(value);
    debouncedTxtSearchChange(value);
  };

  useEffect(() => {
    setUser(props.user);
  }, [props.user]);

  const handleChangeList = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getRequestByRoleOfSender(
        "MEMBER",
        debouncedTxtSearch,
        category,
        page
      );
      if (response.requestsData.length > 0) {
      }
      setListRequests(response.requestsData);
      setTotalElements(response.totalElements);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }, [page, props.listNumber, debouncedTxtSearch, category]);

  useEffect(() => {
    setTxtSearch("");
    debouncedTxtSearchChange("");
    setCategory("Tất cả");
  }, [props.listNumber]);

  useEffect(() => {
    handleChangeList();
  }, [user, page, props.listNumber, debouncedTxtSearch, category]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
    setPage(1);
    setTxtSearch("");
    debouncedTxtSearchChange("");
  };
  return (
    <>

      <div className="myaccount-orders">
        <div className="row mb-2">
          <div className="col-md-5">
          </div>
          <div className="umino-sidebar_categories col-md-4 mb-2 px-0 flex">
            <input
              style={{ height: "40px" }}
              type="text"
              placeholder={t("JewelriesWaitList.Tên tài sản...")}
              value={txtSearch}
              onChange={handleTxtSearch}
            />
          </div>
          <div className="umino-sidebar_categories col-md-3 mb-2 flex">
            <select
              className="rounded"
              value={category}
              onChange={handleCategoryChange}
              style={{
                width: "100%",
                height: "40px",
                padding: "0 0 0 10px",
                borderColor: "#fdb828",
                borderWidth: "2px",
              }}
              required
            >
              {categoryNames.map((category, index) => (
                <option
                  style={{ padding: "5px" }}
                  key={index}
                  value={category}
                >
                  {t(`JewelriesWaitList.${category}`)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <tbody>
              <tr>
                <th>{t("JewelriesWaitList.Mã tài sản")}</th>
                <th style={{ width: "30%" }}>
                  {t("JewelriesWaitList.Tên tài sản")}
                </th>
                <th>{t("JewelriesWaitList.Người gửi")}</th>
                <th>{t("JewelriesWaitList.Giá mong muốn")}</th>
                <th>{t("JewelriesWaitList.Ảnh")}</th>
                <th>{t("JewelriesWaitList.Xem chi tiết")}</th>
              </tr>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center">
                    <Spinner animation="border" />
                  </td>
                </tr>
              ) : listRequests.length > 0 ? (
                listRequests.map((request) => (
                  <JewelryWaitSingle
                    key={request.id}
                    request={request}
                    jewelry={request.jewelry}
                    user={props.user}
                    setNotification={setNotification}
                    handleChangeList={handleChangeList}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center">
                    <h5 className="fw-semibold lh-base mt-2">
                      {t("JewelriesWaitList.Chưa có yêu cầu nào được gửi đến")}
                    </h5>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <ToastContainer />
          <div className="mt-4">
            <PaginationControl
              page={page}
              between={5}
              total={totalElements}
              limit={5}
              changePage={(page) => {
                setPage(page);
              }}
              ellipsis={1}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default JewelriesWaitList;

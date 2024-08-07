import React, { useCallback, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { RequestApproval } from "../../../../models/RequestApproval";
import { getRequestByUserId } from "../../../../api/RequestApprovalAPI";
import { formatNumber } from "../../../../utils/formatNumber";
import { formatDateStringAcceptNull } from "../../../../utils/formatDateString";
import { ViewJewelryRequestModal } from "../../Modal/Modal";
import { PaginationControl } from "react-bootstrap-pagination-control";
import { useTranslation } from "react-i18next";
import { useDebouncedCallback } from "use-debounce";
import { useCategories } from "../../../../hooks/useCategories";

interface MyJewelryListProps {
  userId: number | undefined;
  listNumber: number;
}

export const MyJewelryRequestList: React.FC<MyJewelryListProps> = ({
  userId,
  listNumber,
}) => {
  const [myJewelryRequestList, setMyJewelryRequestList] = useState<
    RequestApproval[]
  >([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [debouncedTxtSearch, setDebouncedTxtSearch] = useState("");
  const [txtSearch, setTxtSearch] = useState("");
  const { t } = useTranslation(["MyJewelryRequestList"]);
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

  const handleChangeList = useCallback(async () => {
    setLoading(true);
    if (userId) {
      try {
        const response = await getRequestByUserId(
          userId,
          debouncedTxtSearch,
          category,
          page
        );
        setMyJewelryRequestList(response.requestsData);
        setTotalElements(response.totalElements);
      } catch (error) {
        console.error(error);
      }
    }
    setLoading(false);
  }, [userId, page, debouncedTxtSearch, category]);

  useEffect(() => {
    handleChangeList();
  }, [userId, page, handleChangeList, debouncedTxtSearch]);

  useEffect(() => {
    setTxtSearch("");
    debouncedTxtSearchChange("");
    setCategory("Tất cả");
  }, [listNumber]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
    setPage(1);
    setTxtSearch("");
    debouncedTxtSearchChange("");
  };



  return (
    <>
      <div className="row mb-2">
        <div className="col-md-5">
        </div>
        <div className="umino-sidebar_categories col-md-4 px-0 mb-2">
          <input
            style={{ height: "40px" }}
            type="text"
            placeholder={t("MyJewelryRequestList.Tên tài sản...")}
            onChange={handleTxtSearch}
            value={txtSearch}
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
                {t(`MyJewelryRequestList.${category}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="text-center">
            <tr>
              <th>{t("MyJewelryRequestList.Mã tài sản")}</th>
              <th>{t("MyJewelryRequestList.Tên tài sản")}</th>
              <th>{t("MyJewelryRequestList.Giá mong muốn (VNĐ)")}</th>
              <th>{t("MyJewelryRequestList.Thời gian gửi")}</th>
              <th>{t("MyJewelryRequestList.Trạng thái")}</th>
              <th>{t("MyJewelryRequestList.Thao tác")}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center">
                  <Spinner animation="border" />
                </td>
              </tr>
            ) : myJewelryRequestList.length > 0 ? (
              React.Children.toArray(
                myJewelryRequestList.map((request) => (
                  <tr>
                    <td>{request.jewelry?.id}</td>
                    <td className="text-start">{request.jewelry?.name}</td>
                    <td>{formatNumber(request.desiredPrice)}</td>
                    <td>
                      {formatDateStringAcceptNull(request?.requestTime)}
                    </td>

                    {request.state === "HIDDEN" ? (
                      <td className="fw-semibold text-start text-danger">
                        {t("MyJewelryRequestList.Đã bị hủy")}
                      </td>
                    ) : (
                      <td
                        className={`fw-semibold text-start ${request.isConfirm ? "text-success" : "text-dark"
                          }`}
                      >
                        {request.isConfirm
                          ? t("MyJewelryRequestList.Đã phê duyệt")
                          : t("MyJewelryRequestList.Chưa phê duyệt")}
                      </td>
                    )}
                    <td>
                      <ViewJewelryRequestModal request={request} />
                    </td>
                  </tr>
                ))
              )
            ) : (
              <tr>
                <td colSpan={6} className="text-center">
                  <h5 className="fw-semibold lh-base mt-2">
                    {t(
                      "MyJewelryRequestList.Chưa có yêu cầu nào được gửi đi"
                    )}
                  </h5>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        <PaginationControl
          page={page}
          between={3}
          total={totalElements}
          limit={5}
          changePage={(page) => {
            setPage(page);
          }}
          ellipsis={1}
        />
      </div>
    </>
  );
};

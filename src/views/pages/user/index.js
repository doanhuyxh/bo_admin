// @ts-nocheck
// ** React Imports
import { Fragment, useState, useEffect, memo } from "react";
// ** Store & Actions
import { toast } from "react-toastify";
import {
  MoreVertical,
  Edit,
  Lock,
  Delete,
  DollarSign,
  Database,
  Shield,
  RefreshCcw,
} from "react-feather";
import _ from "lodash";
import "./index.scss";
import { useForm } from "react-hook-form";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import Service from "../../../services/request";
import ReactPaginate from "react-paginate";
import { ChevronDown } from "react-feather";
import DataTable from "react-data-table-component";
import { number_to_price, checkRole } from "./../../../helper/common";
import FileUploaderBasic from "../../forms/form-elements/file-uploader/FileUploaderBasic";
import "uppy/dist/uppy.css";
import "@uppy/status-bar/dist/style.css";
import "@styles/react/libs/file-uploader/file-uploader.scss";
import {
  Card,
  Input,
  Label,
  Row,
  Col,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  InputGroup,
  InputGroupButtonDropdown,
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  FormGroup,
  Form,
} from "reactstrap";
import moment from "moment";
import { HOST } from "../../../constants/url";

const statusOptions = [
  { value: "", label: "All Status" },
  { value: 1, label: "Active" },
  { value: 0, label: "Lock" },
];

const DefaultFilter = {
  filter: {
    active: 1,
  },
  skip: 0,
  limit: 20,
  order: {
    key: "createdAt",
    value: "desc",
  },
};
const List_Search_Filter = ["username", "referUser", "phoneNumber"];
const DataTableServerSide = () => {

  // ** Store Vars
  const serverSideColumns = [
    {
      name: "ID",
      selector: "userId",
      sortable: true,
      maxWidth: "60px",
    },
    {
      name: "User Name",
      selector: "username",
      sortable: true,
      minWidth: "200px",
      cell: (row) => {
        const {
          userId,
          username
        } = row;

        if(isAdmin){
        
        return (
          <span style={{cursor:'pointer'}}
            onClick={(e) => {
              e.preventDefault();
              window.location.href = `/pages/user-detail/${userId}`
            }}
          >
            {username}
          </span>
        );}else{
          return(
            <>
              <span>{username}</span>
            </>
          )
        }
      },
    },
    {
      name: "name",
      selector: "firstName",
      sortable: true,
      minWidth: "100px",
    },
    {
      name: "Phone Number",
      selector: "phoneNumber",
      sortable: true,
      minWidth: "200px",
    },
    {
      name: "Reference User",
      selector: "referUser",
      cell: (item) => {
        const { referUser } = item;
        return referUser || "";
      },
    },
    {
      name: "Id Number",
      selector: "socmnd",
      sortable: true,
      cell: (row) => {
        const { socmnd } = row;

        return (
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              setUserImage(row);
              setModalImage(true);
            }}
          >
            {socmnd}
          </a>
        );
      },
    },
    {
      name: "Active",
      selector: "active",
      sortable: true,
      maxWidth: "100px",
      cell: (row) => {
        const { active } = row;

        return <div>{active ? "Active" : "Lock"}</div>;
      },
    },
    {
      name: "Balance",
      selector: "balance",
      sortable: true,
      maxWidth: "200px",
      cell: (row) => {
        const { balance } = row;

        return <div>{number_to_price(balance)}</div>;
      },
    },
    {
      name: "Created",
      selector: "salary",
      sortable: true,
      maxWidth: "200px",
      cell: (row) => {
        const { createdAt } = row;

        return <div>{moment(createdAt).format("lll")}</div>;
      },
    },
  ];

  const serverCustormer = [
    {
      name: "Total Bet",
      selector: "totalBet",
    },
    {
      name: "Today Bet",
      selector: "totalTodayBet",
    },
    {
      name: "Total Deposit",
      selector: "totalDeposit",
    },
    {
      name: "Today Deposit",
      selector: "totalTodayDeposit",
    },
    {
      name: "Total Withdraw",
      selector: "totalWithdraw",
    },
    {
      name: "Today Withdraw",
      selector: "totalTodayWithdraw",
    },
    {
      name: "Total Win",
      selector: "totalWin",
    },
    {
      name: "Today Win",
      selector: "totalTodayWin",
    },
    {
      name: "Total lose",
      selector: "totalLose",
    },
    {
      name: "Today lost",
      selector: "totalTodayLose",
    },
    {
      name: "Ballance",
      selector: "ballance",
      render: (item) => {
        const { wallets } = item;
        if (wallets && wallets[0]) {
          return number_to_price(wallets[0].balance);
        }
        return "-";
      },
    },
    {
      name: "Reference User",
      selector: "referUser",
      render: (item) => {
        const { referUser } = item;
        return referUser || "-";
      },
    },
  ];

  if (checkRole("EDIT_USERS")) {
    serverSideColumns.push({
      name: "Action",
      selector: "action",
      cell: (row) => {
        const {
          userId,
          firstName,
          lastName,
          phoneNumber,
          socmnd,
          sotaikhoan,
          tennganhang,
          tentaikhoan,
          cmndnguoi,
          cmndsau,
          cmndtruoc,
          active,
          note,
        } = row;

        return (
          <UncontrolledDropdown>
            <DropdownToggle
              className="icon-btn hide-arrow"
              color="transparent"
              size="sm"
              caret
            >
              <MoreVertical size={15} />
            </DropdownToggle>
            <DropdownMenu right>
              {true && 
              <DropdownItem
              href="/"
              onClick={(e) => {
                e.preventDefault();
                setModal(true);
                setUserData({
                  userId,
                  firstName,
                  lastName,
                  phoneNumber,
                  socmnd,
                  sotaikhoan,
                  tennganhang,
                  tentaikhoan,
                  cmndnguoi,
                  cmndsau,
                  cmndtruoc,
                  note,
                  active,
                });
                handleFindById({ id: userId });
              }}
            >
              <Edit className="mr-50" size={15} />{" "}
              <span className="align-middle">Edit</span>
            </DropdownItem>
              }
              <DropdownItem
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  const newData = {
                    id: userId,
                    data: {
                      active: 0,
                    },
                  };
                  handleUpdateData(newData, "Action Lock Successful!");
                }}
              >
                <Lock className="mr-50" size={15} />{" "}
                <span className="align-middle">Lock</span>
              </DropdownItem>
              <DropdownItem
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  setModalModalPassword(true);
                  setUserDataAll(row);
                }}
              >
                <Shield className="mr-50" size={15} />{" "}
                <span className="align-middle">Change password</span>
              </DropdownItem>
              <DropdownItem
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  setModalModalPoint(true);
                  setUserDataAll(row);
                }}
              >
                <Shield className="mr-50" size={15} />{" "}
                <span className="align-middle">Add Point</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        );
      },
    });
  }
  const [paramsFilter, setParamsFilter] = useState(DefaultFilter);
  // ** States
  const [modal, setModal] = useState(false);
  const [modalPassword, setModalModalPassword] = useState(false);
  const [modalPoint, setModalModalPoint] = useState(false);
  const [userDataAll, setUserDataAll] = useState({});
  const [modalImage, setModalImage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [total, setTotal] = useState(20);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchField, setSearchField] = useState("username");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userFindData, setUserFindData] = useState({});
  const [isAdmin, setIsAdmin] = useState(false)
  // ** React hook form vars
  const { register, errors, handleSubmit } = useForm({
    defaultValues: {},
  });
  const [userData, setUserData] = useState({});
  const [userImage, setUserImage] = useState({});

  function getData(params, isNoLoading) {
    const newParams = {
      ...params,
    };
    if (!isNoLoading) {
      setIsLoading(true);
    }
    Object.keys(newParams.filter).forEach((key) => {
      if (!newParams.filter[key] || newParams.filter[key] === "") {
        delete newParams.filter[key];
      }
    });
    const token = window.localStorage.getItem("accessToken");

    if (token) {
      const newToken = token.replace(/"/g, "");

      Service.send({
        method: "POST",
        path: "User/getListlUser",
        data: newParams,
        query: null,
        headers: {
          Authorization: `Bearer ` + newToken,
        },
      }).then((res) => {
        if (res) {
          const { statusCode, data, message } = res;
          setParamsFilter(newParams);
          if (statusCode === 200) {
            console.log("data user", data.data);
            setTotal(data.total);
            setItems(data.data);
          } else {
            toast.warn(message || "Something was wrong!");
          }
        } else {
          setTotal(1);
          setItems([]);
        }
        if (!isNoLoading) {
          setIsLoading(false);
        }
      });
    } else {
      window.localStorage.clear();
    }
  }

  function handleFindById(item) {
    Service.send({
      method: "POST",
      path: "User/getDetailUserById",
      data: item,
      query: null,
    }).then((res) => {
      if (res) {
        const { statusCode, data } = res;
        if (statusCode === 200) {
          let {
            userId,
            firstName,
            lastName,
            phoneNumber,
            socmnd,
            sotaikhoan,
            tennganhang,
            tentaikhoan,
            cmndnguoi,
            cmndsau,
            cmndtruoc,
            active,
            note,
          } = data;
          cmndsau =
            cmndsau != null && cmndsau != ""
              ? cmndsau
              : `${HOST}uploads/images.png`;
          cmndtruoc =
            cmndtruoc != null && cmndtruoc != ""
              ? cmndtruoc
              : `${HOST}uploads/images.png`;
          setUserFindData(data);
          setUserData({
            userId,
            firstName,
            lastName,
            phoneNumber,
            socmnd,
            sotaikhoan,
            tennganhang,
            tentaikhoan,
            cmndnguoi,
            cmndsau,
            cmndtruoc,
            note,
            active,
          });
        }
      }
    });
  }

  function handleUpdateData(item, messageSuccess) {
    Service.send({
      method: "POST",
      path: "User/staffEditUser",
      data: item,
      query: null,
    }).then((res) => {
      if (res) {
        const { statusCode, message } = res;
        if (statusCode === 200) {
          toast.success(messageSuccess || "Action update successful!");
          getData(paramsFilter);
        } else {
          toast.warn(message || "Something was wrong!");
        }
      }
    });
  }

  function handleUpdatePassWord(item) {
    Service.send({
      method: "POST",
      path: "User/staffChangePasswordUser",
      data: item,
      query: null,
    }).then((res) => {
      if (res) {
        const { statusCode, message } = res;
        if (statusCode === 200) {
          toast.success("Action successful!");
        } else {
          toast.warn(message || "Something was wrong!");
        }
      }
    });
  }

  function handleAddPoint(item) {
    Service.send({
      method: "POST",
      path: "DepositTransaction/addUserPointByStaff",
      data: item,
      query: null,
    }).then((res) => {
      if (res) {
        const { statusCode, message } = res;
        if (statusCode === 200) {
          toast.success("Action successful!");
        } else {
          toast.warn(message || "Something was wrong!");
        }
      }
    });
  }

  function handleUpload(imageString, name) {
    Service.send({
      method: "post",
      path: "Upload/uploadMediaFile",
      data: {
        imageData: imageString,
        imageFormat: "png",
      },
    }).then((result) => {
      if (result) {
        const { statusCode, data: imageData } = result;
        if (statusCode === 200) {
          setUserData({
            ...userData,
            [name]: imageData,
          });
        }
      }
    });
  }

  const getDataSearch = _.debounce((params) => {
    getData(params, true);
  }, 2000);

  // ** Function to handle filter
  const handleFilter = (e) => {
    const { value } = e.target;
    setSearchValue();
    const newParams = {
      ...paramsFilter,
      filter: {
        ...paramsFilter.filter,
        [searchField]: value,
      },
      skip: 0,
    };
    getDataSearch(newParams);
  };

  // ** Function to handle Pagination and get data
  const handlePagination = (page) => {
    const newParams = {
      ...paramsFilter,
      skip: page.selected * paramsFilter.limit,
    };
    getData(newParams);
    setCurrentPage(page.selected + 1);
  };

  // ** Function to handle per page
  const handlePerPage = (e) => {
    const newParams = {
      ...paramsFilter,
      limit: parseInt(e.target.value),
      skip: 0,
    };
    getData(newParams);
    setCurrentPage(1);
    setRowsPerPage(parseInt(e.target.value));
  };

  const handleChangeSearchField = (filed) => {
    const newParams = {
      ...paramsFilter,
      skip: 0,
    };
    List_Search_Filter.forEach((text) => {
      delete newParams.filter[text];
    });
    newParams.filter[filed] = "";
    setSearchValue("");
    setSearchField(filed);
    getData(newParams);
  };

  const handleFilterChange = (name, value) => {
    const newParams = {
      ...paramsFilter,
      filter: {
        ...paramsFilter.filter,
        [name]: value,
      },
      skip: 0,
    };
    getData(newParams);
  };

  // ** Custom Pagination
  const CustomPagination = () => {
    const count = Number(Math.ceil(total / rowsPerPage).toFixed(0));

    return (
      <ReactPaginate
        previousLabel={""}
        nextLabel={""}
        breakLabel="..."
        pageCount={count || 1}
        marginPagesDisplayed={2}
        pageRangeDisplayed={2}
        activeClassName="active"
        forcePage={currentPage !== 0 ? currentPage - 1 : 0}
        onPageChange={(page) => handlePagination(page)}
        pageClassName={"page-item"}
        nextLinkClassName={"page-link"}
        nextClassName={"page-item next"}
        previousClassName={"page-item prev"}
        previousLinkClassName={"page-link"}
        pageLinkClassName={"page-link"}
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName={
          "pagination react-paginate separated-pagination pagination-sm justify-content-end pr-1 mt-1"
        }
      />
    );
  };

  const toggleDropDown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleOnchange = (name, value) => {
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });
  };

  const handleChangeCCCD = (file, name) => {
    convertFileToBase64(file).then((dataUrl) => {
      const newData = dataUrl.replace(/,/gi, "").split("base64");
      Service.send({
        method: "post",
        path: "Upload/uploadMediaFile",
        data: {
          imageData: newData[1],
          imageFormat: "png",
        },
      }).then((result) => {
        if (result) {
          const { statusCode, data: imageData } = result;
          if (statusCode === 200) {
            setUserData({
              ...userData,
              [name]: imageData,
            });
          }
        }
      });
    });
  };

  
  // ** Get data on mount
  useEffect(() => {
    let adminUser = JSON.parse(localStorage.getItem("userData"))
    console.log(adminUser)
    if(adminUser.roleName === "Admin"){
      setIsAdmin(true)
    }
    getData(paramsFilter);
  }, []);


  return (
    <Fragment>
      <Card>
        <Row className="mx-0 mt-1 mb-50">
          <Col sm="6">
            <div className="d-flex align-items-center">
              <Label for="sort-select">show</Label>
              <Input
                className="dataTable-select"
                type="select"
                bsSize="sm"
                id="sort-select"
                value={rowsPerPage}
                onChange={(e) => handlePerPage(e)}
              >
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </Input>
              <Label for="sort-select">entries</Label>
            </div>
          </Col>
          <Col sm="2">
            <Input
              onChange={(e) => {
                const { name, value } = e.target;
                handleFilterChange(name, value);
              }}
              type="select"
              value={
                paramsFilter.filter ? paramsFilter.filter.active || "" : ""
              }
              name="active"
              bsSize="sm"
            >
              {statusOptions.map((item) => {
                return <option value={item.value}>{item.label}</option>;
              })}
            </Input>
          </Col>
          <Col
            className="d-flex align-items-center justify-content-sm-end mt-sm-0 mt-1"
            sm="4"
          >
            <Label className="mr-1" for="search-input">
              Search
            </Label>
            <InputGroup className="input-search-group">
              <InputGroupButtonDropdown
                addonType="prepend"
                isOpen={dropdownOpen}
                toggle={toggleDropDown}
              >
                <DropdownToggle size="sm" color="primary" caret outline>
                  {searchField}
                </DropdownToggle>
                <DropdownMenu>
                  {List_Search_Filter.map((text) => (
                    <DropdownItem
                      className="dropdownItem-search"
                      onClick={() => {
                        handleChangeSearchField(text);
                      }}
                      key={text}
                    >
                      {text}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </InputGroupButtonDropdown>

              <Input
                className="dataTable-filter"
                type="text"
                bsSize="sm"
                id="search-input"
                value={searchValue}
                onChange={(e) => {
                  handleFilter(e);
                }}
              />
            </InputGroup>
          </Col>
        </Row>
        <DataTable
          noHeader
          pagination
          paginationServer
          className="react-dataTable"
          columns={serverSideColumns}
          sortIcon={<ChevronDown size={10} />}
          paginationComponent={CustomPagination}
          data={items}
          progressPending={isLoading}
        />
      </Card>

      <Modal
        isOpen={modal}
        toggle={() => setModal(false)}
        className={`modal-dialog-centered `}
        size="lg"
      >
        <ModalHeader toggle={() => setModal(false)}>Edit User Info</ModalHeader>
        <ModalBody>
          <Row>
            <Col sm="6">
              <Form
                onSubmit={handleSubmit((data) => {
                  const newData = {
                    ...data,
                    cmndtruoc: userData.cmndtruoc || "",
                    cmndsau: userData.cmndtruoc || "",
                    cmndnguoi: userData.cmndnguoi || "",
                    socmnd: userData.socmnd || "",
                    tentaikhoan: userData.tentaikhoan || "",
                    sotaikhoan: userData.sotaikhoan || "",
                    tennganhang: userData.tennganhang || "",
                    note: userData.note || "",
                  };
                  Object.keys(newData).forEach((key) => {
                    if (!newData[key]) {
                      newData[key] = "";
                    }
                  });
                  console.log("newData", newData);
                  handleUpdateData({
                    id: userData.userId,
                    data: newData,
                  });
                  setModal(false);
                })}
              >
                <FormGroup inline>
                  <Label>Status</Label>
                  <Input
                    type="select"
                    name="active"
                    innerRef={register({ required: true })}
                    invalid={errors.active && true}
                    value={userData.active}
                    onChange={(e) => {
                      const { name, value } = e.target;
                      handleOnchange(name, value);
                    }}
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Lock</option>
                  </Input>
                </FormGroup>
                <FormGroup inline>
                  <Label for="firstName">Full Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    innerRef={register({ required: true })}
                    invalid={errors.firstName && true}
                    placeholder="Bruce"
                    value={userData.firstName || ""}
                    onChange={(e) => {
                      const { name, value } = e.target;
                      handleOnchange(name, value);
                    }}
                  />
                </FormGroup>

                <FormGroup inline>
                  <Label for="phoneNumber">Phone Number</Label>
                  <Input
                    innerRef={register({ required: true })}
                    invalid={errors.lastNameBasic && true}
                    name="phoneNumber"
                    placeholder="+84943881692"
                    options={{ phone: true, phoneRegionCode: "VI" }}
                    value={userData.phoneNumber || ""}
                    onChange={(e) => {
                      const { name, value } = e.target;
                      handleOnchange(name, value);
                    }}
                  />
                </FormGroup>
                <FormGroup inline>
                  <Label for="socmnd">ID Number</Label>
                  <Input
                    name="socmnd"
                    id="socmnd"
                    value={userData.socmnd || ""}
                    placeholder=""
                    onChange={(e) => {
                      const { name, value } = e.target;
                      handleOnchange(name, value);
                    }}
                  />
                </FormGroup>

                <FormGroup inline>
                  <Label for="tentaikhoan">Account name</Label>
                  <Input
                    name="tentaikhoan"
                    id="tentaikhoan"
                    value={userData.tentaikhoan || ""}
                    placeholder=""
                    onChange={(e) => {
                      const { name, value } = e.target;
                      handleOnchange(name, value);
                    }}
                  />
                </FormGroup>
                <FormGroup inline>
                  <Label for="sotaikhoan">Account number</Label>
                  <Input
                    name="sotaikhoan"
                    id="sotaikhoan"
                    value={userData.sotaikhoan || ""}
                    placeholder=""
                    onChange={(e) => {
                      const { name, value } = e.target;
                      handleOnchange(name, value);
                    }}
                  />
                </FormGroup>
                <FormGroup inline>
                  <Label for="tennganhang">Bank name</Label>
                  <Input
                    type="select"
                    name="tennganhang"
                    value={userData.tennganhang}
                    onChange={(e) => {
                      const { name, value } = e.target;
                      handleOnchange(name, value);
                    }}
                  >
                    <option value="null" style={{color:"red"}}>Chuyển sang trạng thái trắng</option>
                    <option value="Vietcom Bank">Vietcom Bank</option>
                    <option value="Exim Bank">Exim Bank</option>
                    <option value="Vietin Bank">Vietin Bank</option>
                    <option value="SacomBank">SacomBank</option>
                    <option value="Vietnam Prosperity Joint-Stock Commercial Bank">
                      Vietnam Prosperity Joint-Stock Commercial Bank
                    </option>
                    <option value="Techcom">Techcom</option>
                    <option value="BIDV Bank">BIDV Bank</option>
                    <option value="MB Bank">MB Bank</option>
                    <option value="KienLong Bank">KienLong Bank</option>
                    <option value="HD Bank">HD Bank</option>
                    <option value="SHB Bank">SHB Bank</option>
                    <option value="SCB Bank">SCB Bank</option>
                    <option value="ACB Bank">ACB Bank</option>
                    <option value="AB Bank">AB Bank</option>
                    <option value="Agri Bank">Agri Bank</option>
                    <option value="Bac A Bank">Bac A Bank</option>
                    <option value="BaoViet Bank">BaoViet Bank</option>
                    <option value="DONGA Bank">DONGA Bank</option>
                    <option value="GP Bank">GP Bank</option>
                    <option value="INDOVINA Bank">INDOVINA Bank</option>
                    <option value="LienViet Post Bank">
                      LienViet Post Bank
                    </option>
                    <option value="Maritime">Maritime</option>
                    <option value="Nam A Bank">Nam A Bank</option>
                    <option value="Navi Bank">Navi Bank</option>
                    <option value="NCB">NCB</option>
                    <option value="OCB (PHUONG DONG)">OCB (PHUONG DONG)</option>
                    <option value="PG Bank">PG Bank</option>
                    <option value="PVCOM Bank">PVCOM Bank</option>
                    <option value="SaiGon Bank">SaiGon Bank</option>
                    <option value="SaA Bank">SaA Bank</option>
                    <option value="ShinHan Bank">ShinHan Bank</option>
                    <option value="Tien Phong Bank">Tien Phong Bank</option>
                    <option value="United Overseas Bank">
                      United Overseas Bank
                    </option>
                    <option value="VIB Bank">VIB Bank</option>
                    <option value="VietABank">VietABank</option>
                    <option value="VPBANK">VPBANK</option>
                  </Input>
                </FormGroup>
                <FormGroup inline>
                  <Label for="note">Note</Label>
                  <Input
                    type="textarea"
                    name="note"
                    id="note"
                    onChange={(e) => {
                      const { name, value } = e.target;
                      handleOnchange(name, value);
                    }}
                    value={userData.note || ""}
                    rows="4"
                    placeholder=""
                  />
                </FormGroup>
                {userData.cmndtruoc && userData.cmndtruoc !== "" ? (
                  <FormGroup inline>
                    <div
                      className="parentImage"
                      style={{ display: "flex", justifyContent: "flex-start" }}
                    >
                      <Delete
                        onClick={() => {
                          setUserData({
                            ...userData,
                            cmndtruoc: "",
                          });
                        }}
                        className="parentImageIcon"
                      ></Delete>
                      <img
                        style={{ maxHeight: "100px", marginTop: "10px" }}
                        src={userData.cmndtruoc}
                      />
                      <div className="mx-2">
                        <span>Edit</span>
                        <input
                          type="file"
                          onChange={(e) => {
                            handleChangeCCCD(e.target.files[0], "cmndtruoc");
                          }}
                        />
                      </div>
                    </div>
                  </FormGroup>
                ) : null}
                {userData.cmndsau && userData.cmndsau !== "" ? (
                  <FormGroup inline>
                    <div
                      className="parentImage"
                      style={{ display: "flex", justifyContent: "flex-start" }}
                    >
                      <div>
                        <Delete
                          onClick={() => {
                            setUserData({
                              ...userData,
                              cmndsau: "",
                            });
                          }}
                          className="parentImageIcon"
                        ></Delete>
                        <img
                          style={{ maxHeight: "100px", marginTop: "10px" }}
                          src={userData.cmndsau}
                        />
                      </div>
                      <div className="mx-2">
                        <span>Edit</span>
                        <input
                          type="file"
                          onChange={(e) => {
                            handleChangeCCCD(e.target.files[0], "cmndsau");
                          }}
                        />
                      </div>
                    </div>
                  </FormGroup>
                ) : null}
                {/* {
                userData.cmndnguoi && userData.cmndnguoi!=="" ?(
                  <FormGroup inline>
              
                    <div className="parentImage">
                    <Delete onClick={()=>{
                      setUserData({
                        ...userData,
                        cmndnguoi: ""
                      })
                    }} className="parentImageIcon"></Delete>
                    <img  style={{maxHeight: "100px", marginTop: "10px"}} src={userData.cmndnguoi} />   
                    </div>
                  </FormGroup>
                ):null}
           */}

                <FormGroup className="d-flex mb-0">
                  <Button.Ripple className="mr-1" color="primary" type="submit">
                    Submit
                  </Button.Ripple>
                </FormGroup>
              </Form>
            </Col>
            <Col style={{ textAlign: "right" }} sm="6 user">
              <table>
                {serverCustormer.map((item) => (
                  <tr>
                    <td style={{ fontWeight: "bold" }}>{item.name}</td>
                    <td>
                      {item.render ? (
                        <>{item.render(userFindData)}</>
                      ) : (
                        <>
                          {userFindData[item.selector]
                            ? +userFindData[item.selector]
                              ? number_to_price(userFindData[item.selector])
                              : userFindData[item.selector]
                            : "-"}
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </table>
              <RefreshCcw
                onClick={() => {
                  toast.success("Refresh success");
                  handleFindById({ id: userData.userId });
                }}
                style={{ marginTop: 10, cursor: "pointer" }}
              />
            </Col>
          </Row>
        </ModalBody>
      </Modal>

      <Modal
        isOpen={modalImage}
        toggle={() => setModalImage(false)}
        className={`modal-dialog-centered `}
      >
        <ModalHeader toggle={() => setModalImage(false)}>
          User ID Number
        </ModalHeader>
        <ModalBody>
          <FileUploaderBasic
            disabled
            setPreviewArr={() => {}}
            previewArr={[{ booksImageUrl: userImage.cmndtruoc }]}
          />
          <FileUploaderBasic
            disabled
            setPreviewArr={() => {}}
            previewArr={[{ booksImageUrl: userImage.cmndsau }]}
          />
          <FileUploaderBasic
            disabled
            setPreviewArr={() => {}}
            previewArr={[{ booksImageUrl: userImage.cmndnguoi }]}
          />
        </ModalBody>
      </Modal>
      <Modal
        isOpen={modalPassword}
        toggle={() => setModalModalPassword(false)}
        className={`modal-dialog-centered `}
      >
        <ModalHeader toggle={() => setModalModalPassword(false)}>
          Change Password
        </ModalHeader>
        <ModalBody>
          <Form
            onSubmit={handleSubmit((data) => {
              handleUpdatePassWord({
                username: userDataAll.username,
                newPassword: userDataAll.newPassword,
              });
              setModalModalPassword(false);
            })}
          >
            <FormGroup>
              <Label for="newPassword">New PassWord</Label>
              <Input
                id="newPassword"
                name="newPassword"
                innerRef={register({ required: true })}
                invalid={errors.firstName && true}
                placeholder="New PassWord"
                value={userDataAll.newPassword || ""}
                type="password"
                onChange={(e) => {
                  const { value } = e.target;
                  setUserDataAll({
                    ...userDataAll,
                    newPassword: value,
                  });
                }}
              />
            </FormGroup>

            <FormGroup className="d-flex mb-0">
              <Button.Ripple className="mr-1" color="primary" type="submit">
                Submit
              </Button.Ripple>
            </FormGroup>
          </Form>
        </ModalBody>
      </Modal>

      <Modal
        isOpen={modalPoint}
        toggle={() => setModalModalPoint(false)}
        className={`modal-dialog-centered `}
      >
        <ModalHeader toggle={() => setModalModalPoint(false)}>
          Add Point
        </ModalHeader>
        <ModalBody>
          <Form
            onSubmit={handleSubmit((data) => {
              handleAddPoint({
                userId: userDataAll.userId,
                pointAmount: userDataAll.pointAmount,
              });
              setModalModalPoint(false);
            })}
          >
            <FormGroup>
              <Label for="pointAmount">Amount</Label>
              <Input
                id="pointAmount"
                name="pointAmount"
                innerRef={register({ required: true })}
                invalid={errors.firstName && true}
                placeholder="Amount"
                value={userDataAll.pointAmount || ""}
                onChange={(e) => {
                  const { value } = e.target;
                  setUserDataAll({
                    ...userDataAll,
                    pointAmount: value,
                  });
                }}
              />
            </FormGroup>

            <FormGroup className="d-flex mb-0">
              <Button.Ripple className="mr-1" color="primary" type="submit">
                Submit
              </Button.Ripple>
            </FormGroup>
          </Form>
        </ModalBody>
      </Modal>
    </Fragment>
  );
};

export default memo(DataTableServerSide);

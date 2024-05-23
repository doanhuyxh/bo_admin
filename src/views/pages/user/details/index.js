import { Fragment, useState, useEffect } from "react";
import Service from "../../../../services/request";
import "./index.css";
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
import _ from "lodash";
import DataTable from "react-data-table-component";
import FileUploaderBasic from "../../../forms/form-elements/file-uploader/FileUploaderBasic";
import { number_to_price, checkRole } from "./../../../../helper/common";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { useForm } from "react-hook-form";

const UserDetail = ({ match }) => {
  const userId = match.params.id;

  const [userData, setUserData] = useState({});
  const [userFindData, setUserFindData] = useState({});
  const [modal, setModal] = useState(false);
  const [modalPoint, setModalModalPoint] = useState(false);
  const [changePointType, setChangePointType] = useState(1);
  const { register, errors, handleSubmit } = useForm({
    defaultValues: {},
  });
  
  

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
  const DefaultFilter = {
    filter: {
      status: 'New'
    },
    skip: 0,
    limit: 20,
    order: {
      key: "createdAt",
      value: "desc"
    }
  }

  const handleUpdateData = (item, messageSuccess) => {
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
        } else {
          toast.warn(message || "Something was wrong!");
        }
      }
    });
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


  const [pointAmount, setPointAmount] = useState();
  function handleAddPoint(item) {
    item.pointAmount *= changePointType;
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
          CallData()
        } else {
          toast.warn(message || "Something was wrong!");
        }
      }
    });
  }

  const CallData = ()=>{
    Service.send({
      method: "POST",
      path: "User/getDetailUserById",
      data: { id: userId },
      query: null,
    }).then((res) => {
      let { statusCode, data } = res;
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
          zaloId,
        } = data;
        cmndsau =
          cmndsau != null && cmndsau != ""
            ? cmndsau
            : `https://admin88.dolaht.com/static/media/placeholder-image.e32d30ea.JPG`;
        cmndtruoc =
          cmndtruoc != null && cmndtruoc != ""
            ? cmndtruoc
            : `https://admin88.dolaht.com/static/media/placeholder-image.e32d30ea.JPG`;
        data.balance = res.data.wallets[0].balance;
        setUserData(data);
        setUserFindData(data);
      }
    });
  }

  useEffect(() => {
    console.log("userId ", userId);
    CallData()
    let newData = {...userData, status: 'New'}
    Service.send({
      method: "POST",
      path: "DepositTransaction/getList",
      data: {},
      query: null,
    })
  }, [userId]);

  return (
    <div className="content-wrapper animate__animated animate__fadeIn">
      <div className="row">
        <div className="col-sm-6">
          <div
            className="card"
            style={{
              background: "rgb(243, 243, 243)",
              borderRadius: "4px",
              padding: "15px",
            }}
          >
            <div className="row">
              <div className="col-sm-6">
                <div
                  className="card"
                  style={{ height: "100%", padding: "6px" }}
                >
                  <span style={{ marginLeft: "5px" }}>
                    Chứng minh thư mặt trước
                  </span>
                  <div
                    style={{
                      marginTop: "10px",
                      display: "flex",
                      justifyContent: "center",
                      padding: "25px",
                    }}
                  >
                    <img width="200px" src={userData.cmndtruoc} />
                  </div>
                </div>
              </div>
              <div className="col-sm-6">
                <div
                  className="card"
                  style={{ height: "100%", padding: "6px" }}
                >
                  <span style={{ marginLeft: "5px" }}>
                    Chứng minh thư mặt sau
                  </span>
                  <div
                    style={{
                      marginTop: "10px",
                      display: "flex",
                      justifyContent: "center",
                      padding: "25px",
                    }}
                  >
                    <img width="200px" src={userData.cmndsau} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="card"
            style={{
              background: "rgb(243, 243, 243)",
              borderRadius: "4px",
              padding: "15px",
            }}
          >
            <div className="row">
              <div className="col-sm-12" style={{ marginTop: "5px" }}>
                <span style={{ fontWeight: "bold", color: "black" }}>
                  LỆNH NẠP TIỀN(CHỈ ĐƯỢC THAY ĐỔI TRẠNG THÁI 1 LẦN)
                  <div className="row" style={{ padding: "5px 15px 0px" }}>
                    <div className="col-sm-6">
                      <div className="row">
                        <span
                          style={{
                            fontWeight: "bold",
                            color: "rgb(205, 104, 104)",
                          }}
                        >
                          Ngày tạo
                        </span>
                        <span
                          style={{
                            fontWeight: "bold",
                            color: "rgb(205, 104, 104)",
                            marginLeft: "5px",
                          }}
                        >
                          17-10-2023 20:28
                        </span>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="row">
                        <span
                          style={{
                            fontWeight: "bold",
                            color: "rgb(205, 104, 104)",
                          }}
                        >
                          Số điểm kiếm được
                        </span>
                        <span
                          style={{
                            fontWeight: "bold",
                            color: "rgb(205, 104, 104)",
                            marginLeft: "5px",
                          }}
                        >
                          500.000 đ
                        </span>
                      </div>
                    </div>
                  </div>
                </span>
              </div>
            </div>
          </div>

          <div
            className="card"
            style={{
              background: "rgb(243, 243, 243)",
              borderRadius: "4px",
              padding: "15px",
            }}
          >
            <div className="row">
              <div className="col-sm-12" style={{ marginTop: "5px" }}>
                <span style={{ fontWeight: "bold", color: "black" }}>
                  LỆNH RÚT TIỀN(CHỈ ĐƯỢC THAY ĐỔI TRẠNG THÁI 1 LẦN)
                  <div className="row" style={{ padding: "5px 15px 0px" }}>
                    <div className="col-sm-6">
                      <div className="row">
                        <span
                          style={{
                            fontWeight: "bold",
                            color: "rgb(205, 104, 104)",
                          }}
                        >
                          Ngày tạo
                        </span>
                        <span
                          style={{
                            fontWeight: "bold",
                            color: "rgb(205, 104, 104)",
                            marginLeft: "5px",
                          }}
                        >
                          17-10-2023 20:28
                        </span>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="row">
                        <span
                          style={{
                            fontWeight: "bold",
                            color: "rgb(205, 104, 104)",
                          }}
                        >
                          Số điểm kiếm được
                        </span>
                        <span
                          style={{
                            fontWeight: "bold",
                            color: "rgb(205, 104, 104)",
                            marginLeft: "5px",
                          }}
                        >
                          500.000 đ
                        </span>
                      </div>
                    </div>
                  </div>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-sm-6">
          <div
            className="card"
            style={{
              background: "rgb(243, 243, 243)",
              borderRadius: "4px",
              padding: "0px 15px 15px",
            }}
          >
            <span style={{ fontWeight: "bold", color: "black" }}>
              UserDetail
            </span>
            <div className="row" style={{ padding: "5px 15px 0px" }}>
              <div className="col-sm-11" style={{ marginTop: "5px" }}>
                <div className="row" style={{ padding: "5px 15px 0px" }}>
                  <span style={{ fontWeight: "bold", color: "black" }}>
                    UserName:
                  </span>
                  <span style={{ fontWeight: "bold", marginLeft: "5px" }}>
                    {userData.username}
                  </span>
                </div>
                <div className="row" style={{ padding: "5px 15px 0px" }}>
                  <span style={{ fontWeight: "bold", color: "black" }}>
                    FullName:
                  </span>
                  <span style={{ fontWeight: "bold", marginLeft: "5px" }}>
                    {`${userData.firstName}`}
                  </span>
                </div>
                <div className="row" style={{ padding: "5px 15px 0px" }}>
                  <span style={{ fontWeight: "bold", color: "black" }}>
                    PhoneNumber:
                  </span>
                  <span style={{ fontWeight: "bold", marginLeft: "5px" }}>
                    {userData.phoneNumber}
                  </span>
                </div>
                
                <div className="row" style={{ padding: "5px 15px 0px" }}>
                  <span style={{ fontWeight: "bold", color: "black" }}>
                    Zalo
                  </span>
                  <span style={{ fontWeight: "bold", marginLeft: "5px" }}>
                    {userData.zaloId}
                  </span>
                </div>
                <div className="row" style={{ padding: "5px 15px 0px" }}>
                  <span style={{ fontWeight: "bold", color: "black" }}>
                    Refer User:
                  </span>
                  <span style={{ fontWeight: "bold", marginLeft: "5px" }}>
                    {userData.referUser}
                  </span>
                </div>
                <div className="row" style={{ padding: "5px 15px 0px" }}>
                  <span style={{ fontWeight: "bold", color: "black" }}>
                    Last Login:
                  </span>
                  <span style={{ fontWeight: "bold", marginLeft: "5px" }}>
                    {userData.lastActiveAt}
                  </span>
                </div>
                <div className="row" style={{ padding: "5px 15px 0px" }}>
                  <span style={{ fontWeight: "bold", color: "black" }}>
                    Bank Number:
                  </span>
                  <span style={{ fontWeight: "bold", marginLeft: "5px" }}>
                    {userData.sotaikhoan}
                  </span>
                </div>
                <div className="row" style={{ padding: "5px 15px 0px" }}>
                  <span style={{ fontWeight: "bold", color: "black" }}>
                    Bank Name:
                  </span>
                  <span style={{ fontWeight: "bold", marginLeft: "5px" }}>
                    {userData.tennganhang}
                  </span>
                </div>
                <div className="row" style={{ padding: "5px 15px 0px" }}>
                  <span style={{ fontWeight: "bold", color: "black" }}>
                    Bank Owner:
                  </span>
                  <span style={{ fontWeight: "bold", marginLeft: "5px" }}>
                    {userData.tentaikhoan}
                  </span>
                </div>
                <div
                  className="row"
                  style={{ padding: "5px 15px 0px", display: "flex" }}
                >
                  <button
                    type="button"
                    className="btn btn-success btn-sm"
                    style={{ display: "flex", alignItems: "center" }}
                    onClick={()=>{
                      setModal(true)
                    }}
                  >
                    <span
                      style={{
                        marginLeft: "5px",
                        whiteSpace: "normal",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      Edit UserDetail
                    </span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-success btn-sm"
                    style={{ display: "flex", alignItems: "center" }}
                    onClick={()=>{
                      setModal(true)
                    }}
                  >
                    <span
                      style={{
                        marginLeft: "5px",
                        whiteSpace: "normal",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      Edit Bank
                    </span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    style={{ display: "flex", alignItems: "center" }}
                    onClick={()=>{
                      handleUpdateData({
                        id: userId,
                        data: {
                          active: 0,
                        },
                      },"Action Lock Successful!");
                    }}
                  >
                    <span
                      style={{
                        marginLeft: "5px",
                        whiteSpace: "normal",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      Lock
                    </span>
                  </button>
                </div>
              </div>
              <div className="col-sm-1"></div>
            </div>
          </div>
          <div
            className="card"
            style={{
              background: "rgb(243, 243, 243)",
              borderRadius: "4px",
              padding: "0px 15px 15px",
            }}
          >
            <div className="row">
              <div className="col-sm-11" style={{ marginTop: "5px" }}>
                <span style={{ fontWeight: "bold", color: "black" }}>
                  User Account
                </span>
                <div className="row" style={{ padding: "5px 15px 0px" }}>
                  <span style={{ fontWeight: "bold", color: "black" }}>
                    Balance:
                  </span>
                  <span style={{ fontWeight: "bold", marginLeft: "5px" }}>
                    {userData.balance}
                  </span>
                </div>
                <div
                  className="row"
                  style={{ padding: "5px 15px 0px", marginTop: "5px" }}
                >
                  <button type="button" className="btn btn-success btn-sm" onClick={()=>{setModalModalPoint(true); setChangePointType(1)}}>
                  Deposit money
                  </button>
                  <button type="button" className="btn btn-danger btn-sm" onClick={()=>{setModalModalPoint(true); setChangePointType(-1)}}>
                  Withdraw money
                  </button>
                </div>
              </div>
              <div className="col-sm-1"></div>
            </div>
          </div>

          <div
            className="card"
            style={{
              background: "rgb(243, 243, 243)",
              borderRadius: "4px",
              padding: "0px 15px 15px",
            }}
          >
            <div className="row">
              <div className="col-sm-11" style={{ marginTop: "5px" }}>
                <span
                  style={{
                    fontWeight: "bold",
                    color: "black",
                    textTransform: "uppercase",
                  }}
                >
                  Chi tiết thu chi(Nạp/Rút)
                </span>
              </div>
              <div className="col-sm-1"></div>
            </div>
            <div className="row">
              <div className="col-sm-10 col-md-9" style={{ marginTop: "5px" }}>
                <span style={{ fontWeight: "bold" }}>Tổng thu</span>
              </div>
              <div className="col-sm-2 col-md-3">
                <span style={{ color: "rgb(20,104,104)" }}>
                  {userData.totalBet}đ
                </span>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-10 col-md-9" style={{ marginTop: "5px" }}>
                <span style={{ fontWeight: "bold" }}>Tổng chi</span>
              </div>
              <div className="col-sm-2 col-md-3">
                <span style={{ color: "rgb(20,104,104)" }}>
                  {userData.totalWithdraw}đ
                </span>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-10 col-md-9" style={{ marginTop: "5px" }}>
                <span style={{ fontWeight: "bold" }}>Tổng lợi nhuận</span>
              </div>
              <div className="col-sm-2 col-md-3">
                <span style={{ color: "rgb(20,104,104)" }}>
                  {userData.totalWin - userData.totalLose}đ
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      
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
                  CallData();
                }}
                style={{ marginTop: 10, cursor: "pointer" }}
              />
            </Col>
          </Row>
        </ModalBody>
      </Modal>

      <Modal
        isOpen={modalPoint}
        toggle={() => setModalModalPoint(false)}
        className={`modal-dialog-centered `}
      >
        <ModalHeader toggle={() => setModalModalPoint(false)}>
          Point change
        </ModalHeader>
        <ModalBody>
          <Form
            onSubmit={handleSubmit((data) => {
              handleAddPoint({
                userId: userId,
                pointAmount: pointAmount,
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
                value={pointAmount || ""}
                onChange={(e) => {
                  const { value } = e.target;
                  setPointAmount(value)
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

    </div>
  );
};

export default UserDetail;

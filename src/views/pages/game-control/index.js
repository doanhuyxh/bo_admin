// @ts-nocheck
// ** React Imports
import { Fragment, useState, useEffect, memo } from "react";
// ** Store & Actions
import { toast } from "react-toastify";
import { MoreVertical, Edit, Lock } from "react-feather";
import _ from "lodash";
import "./index.scss";
import { useForm } from "react-hook-form";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import Service from "../../../services/request";
import ReactPaginate from "react-paginate";
import { ChevronDown } from "react-feather";
import DataTable from "react-data-table-component";
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
import { number_to_price } from "./../../../helper/common";
import Flatpickr from "react-flatpickr";
import moment from "moment";
import "@styles/react/libs/flatpickr/flatpickr.scss";
const statusOptions = [
  { value: "New", label: "New" },
  { value: "Waiting", label: "Waiting" },
  { value: "Pending", label: "Pending" },
  { value: "Completed", label: "Completed" },
  { value: "Deleted", label: "Deleted" },
  { value: "Canceled", label: "Canceled" },
];

const unitOptions = [
  { value: "ETH-USD", label: "ETH" },
  { value: "BTC-USD", label: "BTC" },
];

const DefaultFilter = {
  filter: {
    gameRecordUnit: "BTC-USD",
  },
  skip: 0,
  limit: 20,
  order: {
    key: "createdAt",
    value: "desc",
  },
};
const List_Search_Filter = ["username", "email", "referUser", "phoneNumber"];
const DataTableServerSide = () => {
  // ** Store Vars
  const serverSideColumns = [
    {
      name: "Id",
      selector: "gameRecordId",
      sortable: true,
    },
    {
      name: "Section",
      selector: "gameRecordSection",
      sortable: false,

      cell: (row) => {
        const { gameRecordSection } = row;

        return <div>{gameRecordSection}</div>;
      },
    },
    {
      name: "Price",
      selector: "gameRecordPrice",
      sortable: false,
      cell: (row) => {
        const { gameRecordPrice } = row;
        return <div>{number_to_price(gameRecordPrice)}</div>;
      },
    },
    {
      name: "Unit",
      selector: "gameRecordUnit",
      sortable: false,

      cell: (row) => {
        const { gameRecordUnit } = row;

        return <div>{gameRecordUnit.replace("-USD", "")}</div>;
      },
    },
    {
      name: "Note",
      selector: "gameRecordNote",
      sortable: false,
      cell: (row) => {
        const { gameRecordNote } = row;

        return <div>{gameRecordNote}</div>;
      },
    },
    {
      name: "Token",
      selector: "gameRecordId",
      sortable: false,
      cell: (row) => {
        const { gameRecordSection } = row;
        let now = new Date();    
        let year = now.getFullYear().toString();
        let month = (now.getMonth() + 1).toString().padStart(2, '0');
        let day = now.getDate().toString().padStart(2, '0');
                
        let result = year + month + day + "0"+ gameRecordSection.replace(/:/g, '')
        let modifiedNumber = result.slice(0, -2);

        return <div>{(modifiedNumber.slice(0, -1) + "0" + modifiedNumber.slice(-1))}</div>;
      },
    },
    
    {
      name: "Up/Down",
      selector: "gameRecordStatus",
      sortable: false,
      cell: (row) => {
        const { gameRecordTypeUp } = row;

        return (
          <div
            className={
              gameRecordTypeUp ? "gameRecordTypeUp" : "gameRecordTypeDonw"
            }
          >
            {gameRecordTypeUp ? "M" : "B"}
          </div>
        );
      },
    },
    {
      name: "Status",
      selector: "gameRecordStatus",
      sortable: true,
    },
    {
      name: "Action",
      selector: "action",
      cell: (row) => {
        const {
          gameRecordPrice,
          gameRecordTypeUp,
          gameRecordTypeDown,
          gameRecordTypeOdd,
          gameRecordTypeEven,
          gameRecordUnit,
          gameRecordSection,
          gameRecordNote,
          gameRecordStatus,
          gameRecordId,
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
              <DropdownItem
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  setModal(true);
                  setUserData({
                    gameRecordPrice,
                    gameRecordTypeUp,
                    gameRecordTypeDown,
                    gameRecordTypeOdd,
                    gameRecordTypeEven,
                    gameRecordUnit,
                    gameRecordSection,
                    gameRecordNote,
                    gameRecordStatus,
                    gameRecordId,
                  });
                }}
              >
                <Edit className="mr-50" size={15} />{" "}
                <span className="align-middle">Edit</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        );
      },
    },
  ];
  const [paramsFilter, setParamsFilter] = useState(DefaultFilter);
  // ** States

  const [modal, setModal] = useState(false);
  const [modalMany, setModalMany] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [total, setTotal] = useState(20);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchField, setSearchField] = useState("username");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sectionList, setSectionList] = useState([]);
  // ** React hook form vars
  const { register, errors, handleSubmit } = useForm({
    defaultValues: {},
  });
  const [userData, setUserData] = useState({});

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
        path: "Game/getList",
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

  function handleFetchSection() {
    Service.send({
      method: "POST",
      path: "Game/gameSectionList",
      data: {},
      query: null,
    }).then((res) => {
      if (res) {
        const { statusCode, data } = res;
        if (statusCode === 200) {
          setSectionList(data.data);
        }
      }
    });
  }

  function handleUpdateData(item, messageSuccess) {
    Service.send({
      method: "POST",
      path: "Game/updateById",
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

  function handleAddData(item, messageSuccess) {
    Service.send({
      method: "POST",
      path: "Game/insert",
      data: item,
      query: null,
    }).then((res) => {
      if (res) {
        const { statusCode, message } = res;
        if (statusCode === 200) {
          toast.success(
            messageSuccess || "Action Add Game Control successful!"
          );
          getData(paramsFilter);
        } else {
          toast.warn(message || "Something was wrong!");
        }
      }
    });
  }

  function handleAddDataMany(item, messageSuccess) {
    Service.send({
      method: "POST",
      path: "Game/insertMany",
      data: item,
      query: null,
    }).then((res) => {
      if (res) {
        const { statusCode, message } = res;
        if (statusCode === 200) {
          toast.success(
            messageSuccess || "Action Add Many Game Control successful!"
          );
          getData(paramsFilter);
        } else {
          toast.warn(message || "Something was wrong!");
        }
      }
    });
  }

  const getDataSearch = _.debounce((params) => {
    getData(params, true);
  }, 2000);

  // ** Get data on mount
  useEffect(() => {
    // lấy dữ liệu liên tục
    getData(paramsFilter);
    // setInterval(() => {
    //   getData(paramsFilter);
    // }, 40000);
    

    let currentMinute = (new Date()).getMinutes();

    const interval = setInterval(() => {
      console.log("đã gọi lại")
        const newMinute = (new Date()).getMinutes();
        if (newMinute !== currentMinute) {
            currentMinute = newMinute;
            getData(paramsFilter);
            console.log("Hàm đã gọi lại");
            setTimeout(()=>{
              getData(paramsFilter);
            }, 10000)
        }
    }, 5000); // Kiểm tra mỗi phút

    handleFetchSection();

    return () => clearInterval(interval);


    // sử lý ban đầu
  }, []);

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

  return (
    <Fragment>
      <Card className="accountAdmin">
        <Row className="mx-0 mt-1 mb-50">
          <Col sm="8">
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
                paramsFilter.filter
                  ? paramsFilter.filter.gameRecordUnit || ""
                  : ""
              }
              name="gameRecordUnit"
              bsSize="sm"
            >
              {unitOptions.map((item) => {
                return <option value={item.value}>{item.label}</option>;
              })}
            </Input>
          </Col>
          <Col sm="1">
            <Button.Ripple
              color="primary"
              size="sm"
              onClick={() => {
                setModalMany(true);
                setUserData({
                  gameRecordUnit: "ETH-USD",
                  gameRecordCount: 10,
                  gameRecordSection: moment().format("HH:MM") + ":00",
                });
              }}
            >
              Records
            </Button.Ripple>
          </Col>

          <Col sm="1">
            <Button.Ripple
              color="primary"
              size="sm"
              onClick={() => {
                setModal(true);
                setUserData({
                  gameRecordTypeUp: 1,
                  gameRecordTypeOdd: 1,
                  gameRecordUnit: "ETH-USD",
                  gameRecordStatus: "New",
                  gameRecordSection: moment().format("HH:MM") + ":00",
                });
              }}
            >
              Add
            </Button.Ripple>
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
        <Modal
          isOpen={modal}
          toggle={() => setModal(false)}
          className={`modal-dialog-centered `}
        >
          <ModalHeader toggle={() => setModal(false)}>
            {userData.gameRecordId ? "Edit" : "Add"} Game Control
          </ModalHeader>
          <ModalBody>
            <Form
              onSubmit={handleSubmit(() => {
                const data = {
                  // gameRecordPrice: userData.gameRecordPrice,
                  gameRecordTypeUp: userData.gameRecordTypeUp || 0,
                  gameRecordTypeDown: userData.gameRecordTypeDown || 0,
                  gameRecordTypeOdd: userData.gameRecordTypeOdd || 0,
                  gameRecordTypeEven: userData.gameRecordTypeEven || 0,
                  gameRecordUnit: userData.gameRecordUnit,
                  gameRecordSection: userData.gameRecordSection,
                  gameRecordNote: userData.gameRecordNote,
                  // gameRecordStatus: userData.gameRecordStatus,
                };
                if (userData.gameRecordId) {
                  handleUpdateData({
                    id: userData.gameRecordId,
                    data,
                  });
                } else {
                  handleAddData(data);
                }

                setModal(false);
              })}
            >
              <FormGroup>
                <Label for="gameRecordSection">Section</Label>
                <Input
                  type="select"
                  name="gameRecordSection"
                  innerRef={register({ required: true })}
                  invalid={errors.gameRecordSection && true}
                  value={userData.gameRecordSection}
                  onChange={(e) => {
                    const { name, value } = e.target;
                    handleOnchange(name, value);
                  }}
                >
                  {sectionList.map((item, index) => {
                    return (
                      <option value={item.value} key={index}>
                        {item.label}
                      </option>
                    );
                  })}
                </Input>
              </FormGroup>

              <FormGroup>
                <div className="demo-inline-spacing">
                  <FormGroup check inline>
                    <Label check>
                      <Input
                        onChange={(e) => {
                          setUserData({
                            ...userData,
                            gameRecordTypeUp: 1,
                            gameRecordTypeDown: 0,
                          });
                        }}
                        type="radio"
                        name="gameRecordTypeUp"
                        checked={userData.gameRecordTypeUp}
                      />{" "}
                      Up
                    </Label>
                  </FormGroup>
                  <FormGroup check inline>
                    <Label check>
                      <Input
                        onChange={(e) => {
                          setUserData({
                            ...userData,
                            gameRecordTypeUp: 0,
                            gameRecordTypeDown: 1,
                          });
                        }}
                        type="radio"
                        name="gameRecordTypeDown"
                        checked={userData.gameRecordTypeDown}
                      />{" "}
                      Down
                    </Label>
                  </FormGroup>
                </div>
              </FormGroup>
              <FormGroup className='d-none'>
                <div className="demo-inline-spacing">
                  <FormGroup check inline>
                    <Label check>
                      <Input
                        onChange={(e) => {
                          setUserData({
                            ...userData,
                            gameRecordTypeOdd: 1,
                            gameRecordTypeEven: 0,
                          });
                        }}
                        type="radio"
                        name="gameRecordTypeOdd"
                        checked={userData.gameRecordTypeOdd}
                      />{" "}
                      Odd
                    </Label>
                  </FormGroup>
                  <FormGroup check inline>
                    <Label check>
                      <Input
                        onChange={(e) => {
                          setUserData({
                            ...userData,
                            gameRecordTypeOdd: 0,
                            gameRecordTypeEven: 1,
                          });
                        }}
                        type="radio"
                        name="gameRecordTypeEven"
                        checked={userData.gameRecordTypeEven}
                      />{" "}
                      Even
                    </Label>
                  </FormGroup>
                </div>
              </FormGroup>

              <FormGroup>
                <Label>Unit</Label>
                <Input
                  type="select"
                  name="gameRecordUnit"
                  innerRef={register({ required: true })}
                  invalid={errors.gameRecordUnit && true}
                  value={userData.gameRecordUnit}
                  onChange={(e) => {
                    const { name, value } = e.target;
                    handleOnchange(name, value);
                  }}
                >
                  {unitOptions.map((item, index) => {
                    return <option value={item.value}>{item.label}</option>;
                  })}
                </Input>
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
          isOpen={modalMany}
          toggle={() => setModalMany(false)}
          className={`modal-dialog-centered `}
        >
          <ModalHeader toggle={() => setModalMany(false)}>
            Add Many Game Control
          </ModalHeader>
          <ModalBody>
            <Form
              onSubmit={handleSubmit(() => {
                handleAddDataMany(userData);
                setModalMany(false);
              })}
            >
              <FormGroup>
                <Label for="gameRecordSection">Section</Label>
                <Input
                  type="select"
                  name="gameRecordSection"
                  innerRef={register({ required: true })}
                  invalid={errors.gameRecordSection && true}
                  value={userData.gameRecordSection}
                  onChange={(e) => {
                    const { name, value } = e.target;
                    handleOnchange(name, value);
                  }}
                >
                  {sectionList.map((item, index) => {
                    return <option value={item.value}>{item.label}</option>;
                  })}
                </Input>
              </FormGroup>

              <FormGroup>
                <Label>Record</Label>
                <Input
                  type="select"
                  name="gameRecordCount"
                  innerRef={register({ required: true })}
                  invalid={errors.gameRecordCount && true}
                  value={userData.gameRecordCount}
                  onChange={(e) => {
                    const { name, value } = e.target;
                    handleOnchange(name, value);
                  }}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                  <option value={40}>40</option>
                  <option value={50}>50</option>
                </Input>
              </FormGroup>

              <FormGroup>
                <Label>Unit</Label>
                <Input
                  type="select"
                  name="gameRecordUnit"
                  innerRef={register({ required: true })}
                  invalid={errors.gameRecordUnit && true}
                  value={userData.gameRecordUnit}
                  onChange={(e) => {
                    const { name, value } = e.target;
                    handleOnchange(name, value);
                  }}
                >
                  {unitOptions.map((item, index) => {
                    return <option value={item.value}>{item.label}</option>;
                  })}
                </Input>
              </FormGroup>

              <FormGroup className="d-flex mb-0">
                <Button.Ripple className="mr-1" color="primary" type="submit">
                  Submit
                </Button.Ripple>
              </FormGroup>
            </Form>
          </ModalBody>
        </Modal>
      </Card>
    </Fragment>
  );
};

export default memo(DataTableServerSide);

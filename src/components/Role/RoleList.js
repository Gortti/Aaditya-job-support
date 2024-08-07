import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import DataTable from "react-data-table-component";
import IconContainer from "../Common/IconContainer";
import * as Ionicons from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteRole,
  restoreRole,
  retrieveRole,
  activeStatusRole
} from "../../redux/actions/roles";
import { toast, Slide } from "react-toastify";
import FilterComponent from "../../helpers/FilterComponent";
import debounceFunction from "../../helpers/Debounce";
import 'react-toastify/dist/ReactToastify.css';

const EditIcon = Ionicons["IoIosCreate"];
const DeleteIcon = Ionicons["IoIosTrash"];
const RestoreIcon = Ionicons["IoIosRefresh"];
const ActiveIcon = Ionicons["IoIosCheckmarkCircleOutline"];
const InactiveIcon = Ionicons["IoIosCloseCircle"];
toast.configure();

const RoleList = () => {
  const navigate = useNavigate();

  const { role: filteredRole, totalRolecount ,isActive} = useSelector(
    (state) => state.role
  );
  
  const { permissionMap: permissions } = useSelector((state) => state.auth);

  const currentModuleId = 12;

  const permission = permissions.find(perm => perm.moduleId === currentModuleId);

  const dispatch = useDispatch();

  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  useEffect(() => {
    dispatch(retrieveRole());
  }, [dispatch]);

  const handleViewClick = (row) => navigate(`/role/${row.publicId}`);

  const handleStatusToggle = (e, id, isActive) => {
    e.preventDefault();
    dispatch(activeStatusRole(id, isActive))
    .then(() => {
      toast(`Account ${isActive ? "activated" : "deactivated"} successfully!`, {
        transition: Slide,
        closeButton: true,
        autoClose: 3000,
        position: "top-right",
        type: "success",
      });
    })
    .catch((error) => {
      toast(error.response?.data?.message || "An error occurred", {
        transition: Slide,
        closeButton: true,
        autoClose: 3000,
        position: "top-right",
        type: "error",
      });
    });
  };

  const handleDelete = (e, id, action) => {
    e.preventDefault();
    if (action === "delete") {
      dispatch(deleteRole(id))
        .then(() => {
          toast("Role deleted successfully!", {
            transition: Slide,
            closeButton: true,
            autoClose: 3000,
            position: "top-right",
            type: "success",
          });
        })
        .catch((error) => {
          toast(error.response?.data?.message || "An error occurred", {
            transition: Slide,
            closeButton: true,
            autoClose: 3000,
            position: "top-right",
            type: "error",
          });
        });
    } else {
      dispatch(restoreRole(id))
        .then(() => {
          toast("Role restored successfully!", {
            transition: Slide,
            closeButton: true,
            autoClose: 3000,
            position: "top-right",
            type: "success",
          });
        })
        .catch((error) => {
          toast(error.response?.data?.message || "An error occurred", {
            transition: Slide,
            closeButton: true,
            autoClose: 3000,
            position: "top-right",
            type: "error",
          });
        });
    }
  };

  const columns = useMemo(() => {

    const commonColumns = [
      {
        name: "Unique Id",
        selector: (row) => row.publicId,
        sortable: true,
        width: "150px",
        headerStyle: {
          textAlign: "center",
        },
      },
      {
        name: "Name",
        selector: (row) => row.name,
        sortable: true,
        headerStyle: {
          textAlign: "center",
        },
      },
      {
        name: "Description",
        selector: (row) => row.description,
        sortable: true,
        headerStyle: {
          textAlign: "center",
        },
      },
    ];

    const renderActionCell = (row) => {
      const isDeleted = row.deletedAt && row.deletedAt !== null;
  
      if (isDeleted) {
        return permission.delete ? (
          <IconContainer
                id={"restore-icon"}
                Icon={RestoreIcon}
                handleOnClick={(e) => handleDelete(e, row.publicId, "restore")}
                text={"Restore"}
                iconColor={"#3ac47d"}
              />
        ) : null;
      }
  
      return (
        <>
          {permission.update ? (
            <IconContainer
            id={"edit-icon"}
            Icon={EditIcon}
            handleOnClick={() => handleViewClick(row)}
            text="Edit"
          />
          ) : null }
          {permission.delete ? (
            <IconContainer
            id={"delete-icon"}
            Icon={DeleteIcon}
            handleOnClick={(e) => handleDelete(e, row.publicId, "delete")}
            text={"Delete"}
            iconColor={"#d92550"}
          />
          ) : null }
          {permission.statusUpdate ? (
            <IconContainer
            // id={row.name+"-active-icon"}
            id={"subadmin-active-icon"}
            Icon={row.isActive ? ActiveIcon : InactiveIcon}
            text={row.isActive ? "Active" : "Inactive"}
            iconColor={row.isActive ? "#3ac47d" : "#d92550"}
            handleOnClick={(e) => handleStatusToggle(e, row.publicId, !row.isActive)}
          />
          ) : null}
        </>
      );
    };
  
  
    if (permission.delete === 0 && permission.update === 0 && permission.statusUpdate) {
      return commonColumns;
    }

    return [
      ...commonColumns,
      {
        name: "Actions",
        button: true,
        minWidth: "250px",
        headerStyle: { textAlign: "center" },
        cell: renderActionCell,
      },
    ];
  }, [permission, handleViewClick, handleDelete ]);

  const debounceSearch = useCallback(
    debounceFunction((nextValue) => {
      dispatch(retrieveRole(nextValue, 1, perPage));
    }, 1000),
    [dispatch, perPage]
  );

  const subHeaderComponent = useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText("");
        dispatch(retrieveRole("", 1, perPage));
      }
    };

    return (
      <FilterComponent
        onFilter={(event) => {
          setFilterText(event.target.value);
          debounceSearch(event.target.value);
        }}
        onClear={handleClear}
        filterText={filterText}
      />
    );
  }, [filterText, debounceSearch, resetPaginationToggle, dispatch, perPage]);

  const filteredRoles = filteredRole.filter((role) => role.publicId !== 1);

  return (
    <Row>
      <Col>
        <Card className="main-card mb-3">
          <CardHeader className="card-header-sm">
            <div className="card-header-title font-size-lg text-capitalize fw-normal">
              Roles in Your System
            </div>
          </CardHeader>
          <CardBody>
            <DataTable
              columns={columns}
              data={filteredRoles}
              pagination
              paginationServer
              paginationTotalRows={totalRolecount}
              subHeader
              subHeaderComponent={subHeaderComponent}
            />
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default RoleList;

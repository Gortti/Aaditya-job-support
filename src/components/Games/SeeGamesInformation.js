import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback,
  Row,
  Col,
  Card,
  CardBody,
  CardFooter,
} from "reactstrap";
import { toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//import users action
import { updateGame } from "../../redux/actions/game";
import gameService from "../../redux/services/game.service";
import { categories, currencies, platforms, regions } from "./data";
import styles from "../../assets/preview.module.scss";

//import states action
// import { retrieveStates } from "../../redux/actions/states";

//Configure toastify
toast.configure();

const GameInformation = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const dispatch = useDispatch();
  const [currentGame, setCurrentGame] = useState({});

  const [gameImgPreview, setGameImgPreview] = useState(null);
  useEffect(() => {
    const getGames = (id) => {
      gameService
        .get(id)
        .then((response) => {
          setCurrentGame(response?.data?.adInfo);
          console.log(response?.data?.adInfo.adType);
          setGameImgPreview(response?.data?.adInfo?.adImage[0]?.imageUrl)
        })
        .catch((error) => {
          toast(error, {
            transition: Slide,

            closeButton: true,

            autoClose: 3000,

            position: "top-right",

            type: "error",
          });
        });
    };
    getGames(id);
  }, []);

  //states for handling validations

  const [gameErr, setGameErr] = useState("");

  const [priceErr, setPriceErr] = useState("");

  //input change handler
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setCurrentGame({ ...currentGame, [name]: value });
  };

  //validation handler
  const handleValidation = (event) => {
    const inputValue = event.target.value.trim();
    const inputFieldName = event.target.name;
    //set error message for firstName
    if (inputFieldName === "gameName") {
      if (inputValue.length < 1) {
        setGameErr("GameName is required!");
      } else {
        setGameErr("");
      }
    }
    if (inputFieldName === "price") {
      if (inputValue.length < 1) {
        setPriceErr("Price is required!");
      } else {
        setPriceErr("");
      }
    }
  };

  //update form handler
  const updateHandler = (event) => {
    event.preventDefault();
    let errorCount = 0;

    if (errorCount > 0) {
      return;
    } else {
      //dispatch to update the user
      dispatch(updateGame(id, currentGame))
        .then((response) => {
          setCurrentGame({ ...currentGame });
          toast("Game Updated successfully!", {
            transition: Slide,

            closeButton: true,

            autoClose: 3000,

            position: "top-right",

            type: "success", // info/success/warning/error
          });
          setCurrentGame({});
          navigate("/games/list");
        })
        .catch((error) => {
          toast(error.response.data.message, {
            transition: Slide,

            closeButton: true,

            autoClose: 3000,

            position: "top-right",

            type: "error",
          });
        });
    }
  };
  return (
    <>
      <Row>
        <Col md="12">
          <Card className="main-card mb-3">
            <Form>
              <CardBody>
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <Label for="title">Title</Label>
                      <Input
                        type="text"
                        name="title"
                        id="title"
                        placeholder="Title here..."
                        value={currentGame.title ? currentGame.title : ""}
                        onChange={handleInputChange}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label for="gameName">Game Name</Label>
                      <Input
                        invalid={gameErr !== "" ? true : false}
                        type="text"
                        name="gameName"
                        id="gameName"
                        placeholder="Game Name here..."
                        value={currentGame.gameName ? currentGame.gameName : ""}
                        onChange={handleInputChange}
                        onKeyUp={handleValidation}
                      />
                      {gameErr !== "" && <FormFeedback>{gameErr}</FormFeedback>}
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <Label for="platform">Platform</Label>
                      <Input
                        type="select"
                        name="platform"
                        id="platform"
                        value={
                          currentGame.platform != null
                            ? currentGame.platform
                            : ""
                        }
                        onChange={handleInputChange}
                      >
                        <option value=""> Select Platform </option>
                        {platforms &&
                          platforms.map((platform, index) => (
                            <option key={index} value={platform.code}>
                              {platform.name}
                            </option>
                          ))}
                      </Input>
                    </FormGroup>
                  </Col>

                  <Col md="6">
                    <FormGroup>
                      <Label>Category</Label>
                      <Input
                        type="select"
                        name="category"
                        id="category"
                        value={
                          currentGame.category != null
                            ? currentGame.category
                            : ""
                        }
                        onChange={handleInputChange}
                      >
                        <option value=""> Select Category </option>
                        {categories &&
                          categories.map((category, index) => (
                            <option key={index} value={category.code}>
                              {category.name}
                            </option>
                          ))}
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <Label for="price">Price</Label>
                      <Input
                        invalid={priceErr !== "" ? true : false}
                        type="text"
                        name="price"
                        id="price"
                        placeholder="Price here..."
                        value={currentGame.price ? currentGame.price : ""}
                        onChange={handleInputChange}
                        onKeyUp={handleValidation}
                      />
                      {priceErr !== "" && (
                        <FormFeedback>{priceErr}</FormFeedback>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label for="description">Description</Label>
                      <Input
                        type="text"
                        name="description"
                        id="description"
                        placeholder="Description here..."
                        value={
                          currentGame.description ? currentGame.description : ""
                        }
                        onChange={handleInputChange}
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col md="6">
                    <FormGroup>
                      <Label for="region">Region</Label>
                      <Input
                        type="select"
                        name="region"
                        id="region"
                        value={
                          currentGame.region != null ? currentGame.region : ""
                        }
                        onChange={handleInputChange}
                      >
                        <option value=""> Select Region </option>
                        {regions &&
                          regions.map((region, index) => (
                            <option key={index} value={region.code}>
                              {region.name}
                            </option>
                          ))}
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label for="currency">Currency</Label>
                      <Input
                        type="select"
                        name="currency"
                        id="currency"
                        value={
                          currentGame.currency != null
                            ? currentGame.currency
                            : ""
                        }
                        onChange={handleInputChange}
                      >
                        <option value=""> Select Currency </option>
                        {currencies &&
                          currencies.map((currency, index) => (
                            <option key={index} value={currency.code}>
                              {currency.name}
                            </option>
                          ))}
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col md="6">
                    <FormGroup>
                      <Label for="quantity">Quantity</Label>
                      <Input
                        type="text"
                        name="quantity"
                        id="quantity"
                        placeholder="Quantity here..."
                        value={currentGame.quantity ? currentGame.quantity : ""}
                        onChange={handleInputChange}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label for="adKey">AdKey</Label>
                      <Input
                        type="text"
                        name="adKey"
                        id="adKey"
                        placeholder="AdKey here..."
                        value={currentGame.adKey ? currentGame.adKey : ""}
                        onChange={handleInputChange}
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col md="6">
                    <FormGroup>
                      <Label for="deliveryTime">DeliveryTime</Label>
                      <Input
                        type="text"
                        name="deliveryTime"
                        id="deliveryTime"
                        placeholder="DeliveryTime here..."
                        value={
                          currentGame.deliveryTime
                            ? currentGame.deliveryTime
                            : ""
                        }
                        onChange={handleInputChange}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label for="gameImage">Game Image</Label>
                      <Input
                        // invalid={gameImgErr !== "" ? true : false}
                        type="file"
                        name="gameImage"
                        id="gameImage"
                        accept="image/*"
                        // onChange={handleFileInput}
                      />
                      {gameImgPreview && (
                        <div
                          className={styles.previewContainer}
                          style={{
                            position: "relative",
                            display: "inline-block",
                          }}
                        >
                          <img
                            width={100}
                            src={gameImgPreview}
                            alt="preview"
                            onError={() =>
                              setGameImgPreview(
                                `${process.env.REACT_APP_PROFILE_IMAGE_URL}` +
                                  `user.png`
                              )
                            }
                          />
                          <a
                            href="#"
                            className={styles.deleteIcon}
                            // onClick={removeProfilePicture}
                            style={{
                              position: "absolute",
                            }}
                          >
                            <i className="pe-7s-trash"></i>
                          </a>
                        </div>
                      )}
                      {/* {gameImgErr !== "" && (
                        <FormFeedback>{gameImgErr}</FormFeedback>
                      )} */}
                    </FormGroup>
                  </Col>

                  {currentGame.adType === "trade" ? (
                    <>
                      <Col md="6">
                        <FormGroup>
                          <Label for="tradeItemPrice">Trade Item Price</Label>
                          <Input
                            type="text"
                            name="tradeItemPrice"
                            id="tradeItemPrice"
                            placeholder="Item Price here..."
                            // value={tradeItemPrice}
                            // onChange={(e) => setTradeItemPrice(e.target.value)}
                          />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                        <Label for="priceType">Price Type</Label>
                          <Input
                            type="select"
                            name="priceType"
                            id="priceType"
                            // value={priceType}
                            // onChange={(e) => setPriceType(e.target.value)}
                          >
                            <option value="request">Request</option>
                            <option value="offer">Offer</option>
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col md="6">
                    <FormGroup>
                      <Label for="tradeItemCurrency">tradeItemCurrency</Label>
                      <Input
                        type="select"
                        name="tradeItemCurrency"
                        id="tradeItemCurrency"
                        // value={tradeItemCurrency}
                        // onChange={(e) => setTradeItemCurrency(e.target.value)}
                      >
                        <option value=""> Select Trade Item Currency </option>
                        {currencies &&
                          currencies.map((currency, index) => (
                            <option key={index} value={currency.code}>
                              {currency.name}
                            </option>
                          ))}
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label for="tradeItemPic">Trade Item Image</Label>
                      <Input
                        // invalid={tradeImgErr !== "" ? true : false}
                        type="file"
                        name="tradeItemPic"
                        id="tradeItemPic"
                        accept="image/*"
                        // onChange={handleTradeItemFileInput}
                      />
                      {/* {tradeImgPreview && (
                        <div
                          className={styles.previewContainer}
                          style={{
                            position: "relative",
                            display: "inline-block",
                          }}
                        >
                          <img
                            width={100}
                            src={tradeImgPreview}
                            alt="preview"
                            onError={() =>
                              setGameImgPreview(
                                `${process.env.REACT_APP_PROFILE_IMAGE_URL}` +
                                  `user.png`
                              )
                            }
                          />
                          <a
                            href="#"
                            className={styles.deleteIcon}
                            name="tradeItemPic"
                            onClick={removeTradeImage}
                            style={{
                              position: "absolute",
                            }}
                          >
                            <i className="pe-7s-trash"></i>
                          </a>
                        </div>
                      )}
                       {tradeImgErr !== "" && (
                        <FormFeedback>{tradeImgErr}</FormFeedback>
                      )} */}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label for="tradeItemTitle">Trade Item Title</Label>
                      <Input
                        type="text"
                        name="tradeItemTitle"
                        id="tradeItemTitle"
                        placeholder="Trade Item Title here..."
                        // value={tradeItemTitle}
                        // onChange={(e) => setTradeItemTitle(e.target.value)}
                      />
                    </FormGroup>
                  </Col>
                    </>
                  ) : null}
                </Row>
              </CardBody>
              <CardFooter className="d-block">
                <Button
                  className="me-2"
                  color="link"
                  onClick={() => {
                    navigate(`/games/list`);
                  }}
                >
                  Cancel
                </Button>
                <Button size="lg" color="primary" onClick={updateHandler}>
                  Update Games
                </Button>
              </CardFooter>
            </Form>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default GameInformation;

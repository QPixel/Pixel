interface IHeader {
  Authorization: string;
  "Content-Type": ContentType;

}

type ContentType = | "application/json" | "application/x-www-form-urlencoded" 
export default IHeader;
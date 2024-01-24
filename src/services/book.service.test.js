import httpInterceptor from "../httpHelper/httpHelper";
import { getAllBooks } from "./book.service";

describe("books api", ()=>{

    afterEach(()=>{
        jest.clearAllMocks();
    });

    describe("getAllBooks", ()=> {
        it("should get all books", async ()=>{
            const mockResponse = {
                data : {
                    books : []
                }
            };

            const httpInterceptorSpy = jest.spyOn(httpInterceptor, "get").mockResolvedValueOnce(mockResponse);
            await getAllBooks();
            expect(httpInterceptorSpy).toHaveBeenCalledTimes(1);
            expect(httpInterceptorSpy).toHaveBeenCalledWith(
                "http://localhost:8080/books"
            );
        })
    })

})
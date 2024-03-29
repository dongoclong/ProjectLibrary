from fastapi import FastAPI, HTTPException, UploadFile, File, Request, Form
from pydantic import BaseModel
import pandas as pd
import math, csv, asyncio
import os, random, json, shutil, datetime, psutil
from PIL import Image
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import Optional, List
app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
################################
#path_img
img_path = 'D:/Long/Longdayhoc/ProjectLibrary/FrontEnd/build/Images/'
link_img_path = 'http://localhost:3000/Images/'
################################




# Handle products
@app.get("/api/v1/product/show")
async def get_products():
    products_item = []
    # Mở file CSV và đọc dữ liệu
    with open("products.json", "r", encoding= "utf-8") as file:
        products = json.load(file)
        for product in products:
            products_item.append(product)
    return JSONResponse(content=products_item)

def get_username_by_id(id_user):
    json_file_path = "accounts.json"
    # Đọc dữ liệu từ tệp JSON
    with open(json_file_path, "r") as file:
        data = json.load(file)

    # Tìm kiếm user_name dựa trên id_user
    for user in data:
        if user.get("id") == id_user:
            return user.get("user_name")

    # Trả về None nếu không tìm thấy id_user
    return None

@app.patch("/api/v1/product/update/{id_product}")
def update_products(id_product: int, id_user_update: int, word: Optional[str] = None, list_id_img: Optional[str] = None, meaning: Optional[str] = None, note: Optional[str] = None, 
user_add: Optional[str] = None, subject: Optional[str] = None, src_img: List[UploadFile] = File(None)):
 # Đường dẫn đến file CSV
    print(id_product, word, meaning, note, user_add, subject)
    word = word if word != "" else None
    meaning = meaning if meaning != "" else None
    note = note if note != "" else None
    user_add = user_add if user_add != "" else None
    subject = subject if subject != "" else None
    list_link_img = []
    # print(word, meaning, note, user_add, subject)
    list_id_img = list_id_img.split(",")
    list_id_img = list(map(int, list_id_img))
        # for items in list_id_img:
    # Mở file CSV và đọc dữ liệu
    with open("products.json", "r", encoding= "utf-8") as file:
        products = json.load(file)
    # print(list_id_img)
    list_remove = []
    if list_id_img is not None:
        for items in products:
            if items['id'] == id_product:
                # for item in items:
                    images = items['image']
                    for image in images:
                        print(image['id'])
                        print(list_id_img)
                        if int(image['id']) in list_id_img:
                            list_remove.append(image)
                            print('done!')
                        else:
                            continue

                    for image in list_remove:
                            file_name = image['link'].split('/')[-1]
                            file_path = f'{img_path}{file_name}'
                            if os.path.exists(file_path):
                                os.remove(file_path)
                            images.remove(image)
                            print('done!')



                    i = 0
                    for image in images:
                        image['id'] = i
                        i = i+1
                    
                    # for image in images:
                    #     print(image)

    for items in products:
            if items['id'] == id_product:   
                num_img = len(items['image'])

    link_img ={}
    list_link_img = []
    if src_img is not None:
        i = num_img
        for items in src_img:
            file_name = f"{id_product}_{random.randint(0, 100000)}"
            path_to_image = f"{img_path}{file_name}.png"
            with open(path_to_image, "wb") as image:
                image.write(items.file.read())
            link = f"{link_img_path}{file_name}.png"
            link_img = {'id': i,'link': link}
            list_link_img.append(link_img)
            i  = i + 1

    # Mở file CSV và đọc dữ liệu
    # with open("products.json", "r", encoding= "utf-8") as file:
    #     products = json.load(file)


    with open("products_update.json", "r", encoding= "utf-8") as file:
        data = json.load(file)

    # Tìm hàng có id_product tương ứng và cập nhật giá trị
    for product in products:
        if product["id"] == id_product:
            # Cập nhật thông tin hàng hóa nếu có
            if word is not None:
                product["word"] = word
            if meaning is not None:
                product["meaning"] = meaning
            if note is not None:
                product["note"] = note
            if user_add is not None:
                product["user_add"] = user_add
            if subject is not None:
                product["subject"] = subject
            if src_img:
                # print(product["image"])
                # Ghi dữ liệu từ UploadFile vào file
                product["image"].extend(list_link_img)

            date = datetime.datetime.now().strftime('%H:%M:%S %d/%m/%Y')
            user_edit = get_username_by_id(id_user_update)
            new_product = {
                    "id": product["id"],
                    "word": product["word"],
                    "meaning": product["meaning"],
                    "note": product["note"],
                    "image": product["image"],
                    "user_add": user_edit,
                    "date": date,
                    "subject": product["subject"]
                }
            data.append(new_product)

    with open("products_update.json", "w", encoding="utf-8") as file:
        json.dump(data, file, ensure_ascii=False)


    # Ghi lại dữ liệu vào file CSV
    with open("products.json", "w", encoding="utf-8") as file:
        json.dump(products, file, ensure_ascii=False)

    # Trả về phản hồi thành công
    return {"message": "Thay đổi thông tin từ thành công!"}





@app.delete("/api/v1/product/delete/{id_product}")
def delete_products(id_product: int):
    try:
        # Mở file JSON và đọc dữ liệu
        with open("products.json", "r", encoding= "utf-8") as file:
            products = json.load(file)

        # Tìm hàng có id_product tương ứng và cập nhật giá trị
        for product in products:
            if product["id"] == id_product:
                word = product["word"]
                products.remove(product)
                break
            else: 
                return {"message": f"Không thấy từ trong database!!"}

        # Ghi lại dữ liệu vào file JSON
        with open("products.json", "w", encoding="utf-8") as file:
            json.dump(products, file, ensure_ascii=False)

        # Trả về thông báo thành công
        return {"message": f"Xóa từ {word} thành công."}

    except Exception as e:
        # Xử lý ngoại lệ (ví dụ: ghi log lỗi, trả về thông báo lỗi)
        return {"message": f"Đã xảy ra lỗi: {str(e)}"}
        # Trả về thông báo lỗi

@app.post("/api/v1/product/add")
async def create_user(request: Request, src_img: List[UploadFile] = File(None)):
    form_data = await request.form()
    word = form_data.get("word")
    meaning = form_data.get("meaning")
    note = form_data.get("note")
    user_add = form_data.get("user_add")
    subject = form_data.get("subject")
    print("hallo")

    date = datetime.datetime.now().strftime('%H:%M:%S %d/%m/%Y')
    try:
        with open("products.json", "r", encoding= "utf-8") as file:
            data = json.load(file)
    except FileNotFoundError:
        # Nếu file không tồn tại, tạo một danh sách rỗng
        data = []

    try:
        with open("products_update.json", "r", encoding= "utf-8") as file:
            products = json.load(file)
    except FileNotFoundError:
        # Nếu file không tồn tại, tạo một danh sách rỗng
        products = []

    # Tìm ID lớn nhất trong danh sách hoặc đặt mặc định là 0 nếu danh sách rỗng
    max_id = max([product["id"] for product in data]) if data else 0

    new_id = max_id + 1

    link_img ={}
    list_link_img = []
    if src_img is not None:
        i = 0
        for items in src_img:
            file_name = f"{new_id}_{random.randint(0, 100000)}"
            path_to_image = f"{img_path}{file_name}.png"
            with open(path_to_image, "wb") as image:
                image.write(items.file.read())
            link = f"{link_img_path}{file_name}.png"
            link_img = {'id': i,'link': link}
            list_link_img.append(link_img)
            i  = i + 1

    new_product = {
        "id": int(new_id),
        "word": word,
        "meaning": meaning,
        "note": note,
        "image": list_link_img,
        "user_add": user_add,
        "date": date,
        "subject": subject
    }
    data.append(new_product)
    products.append(new_product)
    # Lưu danh sách vào file JSON
    with open("products.json", "w", encoding="utf-8") as file:
        json.dump(data, file, indent=4)

    with open("products_update.json", "w", encoding="utf-8") as file:
        json.dump(data, file, indent=4)

    # return JSONResponse(content=new_product)
    return {"message": f"Đã add thêm từ {word} vào từ điển!"}

# Handle Users
@app.get("/api/v1/user/show")
async def get_users():
    users = []
    json_file_path = "accounts.json"
    try:
        with open(json_file_path, "r", encoding= "utf-8") as file:
            data = json.load(file)
            for user in data:
                # Loại bỏ trường "password" khỏi đối tượng người dùng
                user.pop("password", None)
                users.append(user)
    except FileNotFoundError:
        return {"message": "Không tìm thấy tệp dữ liệu."}
    return JSONResponse(content=users)

@app.post("/api/v1/user/add")
async def create_user(request: Request, src_img: UploadFile = File(None)):
    form_data = await request.form()
    id_user_add = form_data.get("id_user_add")
    user_name = form_data.get("user_name")
    password = form_data.get("password")
    role = form_data.get("role")
    print(id_user_add)
    print(src_img)
    with open("accounts.json", "r", encoding= "utf-8") as file:
        user = json.load(file)

    for items in user:
        if items["id"] == int(id_user_add):
            if items["role"] == "employee":
                return {"message": "Bạn khun có quyền tạo thêm user mới, chỉ người có vai trò Admin mới tạo được!"}
    
    date = datetime.datetime.now().strftime('%H:%M:%S %d/%m/%Y')
    try:
        # Mở tệp JSON và đọc dữ liệu
        with open("accounts.json", "r", encoding= "utf-8") as file:
            data = json.load(file)
    except FileNotFoundError:
        # Nếu tệp không tồn tại, tạo một danh sách rỗng
        data = []

    max_id = max([user["id"] for user in data]) if data else 0
    new_id = max_id + 1


    link_img = f"{link_img_path}avatar.png"
    path_to_image = f"{img_path}{new_id}.png"
    if src_img is not None:
        with open(path_to_image, "wb") as image:
            image.write(src_img.file.read())
        link_img = f"{link_img_path}{new_id}.png"

    # Kiểm tra xem tên người dùng đã tồn tại trong danh sách hay chưa
    if any(user["user_name"] == user_name for user in data):
        return {"message": "Tài khoản đã tồn tại!"}

    # Tạo đối tượng người dùng mới
    new_user = {
        "id": new_id,
        "user_name": user_name,
        "password": password,
        "image": link_img,
        "role": role,
        "date": date
    }

    # Thêm người dùng mới vào danh sách
    data.append(new_user)

    # Ghi lại dữ liệu vào tệp JSON
    with open("accounts.json", "w", encoding="utf-8") as file:
        json.dump(data, file, indent=4)


    # return JSONResponse(content=new_user)
    return {"message": f"Đã add thêm user {user_name} với vai trò {role} !"}

@app.patch("/api/v1/user/update/{id_user}")
def update_users(id_user: int, id_user_edit: int, user_name: Optional[str] = None, old_password: Optional[str] = None, new_password: Optional[str] = None, 
src_img: UploadFile = File(None)):


    user_name = None if user_name == "" else user_name
    old_password = None if old_password == "" else old_password
    new_password = None if new_password == "" else new_password

    
    # Mở file json và đọc dữ liệu
    with open("accounts.json", "r") as file:
        user = json.load(file)
    
    for items in user:
        if items["id"] == int(id_user_edit):
            user_edit_role = items["role"]

    for items in user:
        if items["id"] == int(id_user):
            if user_edit_role == "employee":
                if int(id_user) == int(id_user_edit):
                    if user_name is not None:
                        items["user_name"] = user_name
                    if old_password is not None and new_password is not None:
                        if old_password == items["password"]:
                            items["password"] = new_password
                        else: 
                            return {"message":"Ôi bạn ơi, mật khẩu bạn nhập sai rồi, vui lòng nhập lại!"}
                    if old_password is not None or new_password is not None:
                        if old_password is None:
                            return {"message":"Vui lòng nhập mật khẩu cũ!"}
                        elif new_password is None:
                            return {"message":"Vui lòng nhập mật khẩu mới!"}

                    if src_img is not None:
                        file_name = f"{id_user}_{random.randint(0, 100000)}"
                        path_to_image = f"{img_path}{file_name}.png"
                        with open(path_to_image, "wb") as image:
                            image.write(items.file.read())
                        link_img = f"{link_img_path}{file_name}.png"
                        items["image"] = link_img

                    with open("accounts.json", "w", encoding="utf-8") as file:
                        json.dump(user, file, ensure_ascii=False)
                    return {"message": "Đã thay đổi thông tin thành công!"}

                elif int(id_user) != int(id_user_edit):
                    return {"message": "Ôi bạn ơi, bạn không phải Admin nên không thay đổi được thông tin tài khoản của người khác nhé"}

            elif user_edit_role == "admin":
                if user_name is not None:
                    items["user_name"] = user_name
                if new_password is not None:
                    items["password"] = new_password

                if src_img is not None:
                    file_name = f"{id_user}_{random.randint(0, 100000)}"
                    path_to_image = f"{img_path}{file_name}.png"
                    with open(path_to_image, "wb") as image:
                        image.write(items.file.read())
                    link_img = f"{link_img_path}{file_name}.png"
                    items["image"] = link_img

                with open("accounts.json", "w", encoding="utf-8") as file:
                    json.dump(user, file, ensure_ascii=False)

                return {"message": "Đã thay đổi thông tin thành công!"}
    
@app.delete("/api/v1/user/delete/{id_user}")
def delete_users(id_user: int, id_user_delete: int):
    try:
        # Mở file JSON và đọc dữ liệu
        with open("accounts.json", "r") as file:
            user = json.load(file)

        for items in user:
            if items["id"] == int(id_user_delete):
                role_user_delete = items["role"]
        # Tìm hàng có id_product tương ứng và cập nhật giá trị
        for items in user:
            if items["id"] == int(id_user):
                if role_user_delete == "admin":
                    user.remove(items)
                    break
                elif role_user_delete == "employee":
                    if int(id_user) == int(id_user_delete):
                        user.remove(items)
                        break
                    else:
                        return {"message": f"Bạn không phải admin nên không thể xóa tài khoản này!"}
                else: 
                    return {"message": f"Bạn không phải admin nên không thể xóa tài khoản này!"}

        # Ghi lại dữ liệu vào file JSON
        with open("accounts.json", "w", encoding="utf-8") as file:
            json.dump(user, file, ensure_ascii=False)

        # Trả về thông báo thành công
        return {"message": f"Xóa tài khoản thành công."}

    except Exception as e:
        # Xử lý ngoại lệ (ví dụ: ghi log lỗi, trả về thông báo lỗi)
        return {"message": f"Đã xảy ra lỗi: {str(e)}"}
        # Trả về thông báo lỗi

# Handle Login
@app.post("/api/v1/user/login")
async def login(request: Request):
    form_data = await request.form()
    user_name = form_data.get("user_name")
    password = form_data.get("password")
    
    # Đọc dữ liệu từ file JSON
    with open("accounts.json", "r") as file:
        data = json.load(file)
    
    # Tìm kiếm tài khoản trong dữ liệu đọc từ file JSON
    matched_accounts = [account for account in data if account["user_name"] == user_name and account["password"] == password]
    
    if matched_accounts:
        # Lấy thông tin tài khoản đầu tiên trong danh sách tài khoản khớp
        account_info = matched_accounts[0]
        
        # Trả về thông tin tài khoản
        return {
            "message": "Đăng nhập thành công",
            "user_name": account_info["user_name"],
            "password": account_info["password"],
            "id": account_info["id"],
            "role": account_info["role"],
            "image": account_info["image"],
            "date": account_info["date"]
        }
    else:
        raise HTTPException(status_code=401, detail="Sai tên đăng nhập hoặc mật khẩu")

# Handle edit history
@app.get("/api/v1/product/history/show/{id_product}")
async def get_products_history(id_product: int):
    product = []
    try:
        with open("products_update.json", "r") as file:
            products = json.load(file)

        for items in products:
            if items["id"] == id_product:
                product.append(items)
    except FileNotFoundError:
        return {"message": "Không tìm thấy tệp dữ liệu."}

    return JSONResponse(content=product)



@app.get("/api/v1/performance")
async def get_performance():
    print("hallo")
    content = []
    per = {}
    # CPU information
    cpu_percent = psutil.cpu_percent()
    cpu_count = psutil.cpu_count()
    per['cpu_percent'] = cpu_percent
    per['cpu_count'] = cpu_count

    print(f"CPU Usage: {cpu_percent}%")
    print(f"CPU Count: {cpu_count}")

    # Memory information
    memory = psutil.virtual_memory()
    total_memory = memory.total // (1024 ** 3)  # Convert to GB
    available_memory = memory.available // (1024 ** 3)  # Convert to GB
    per['available_memory'] = available_memory
    per['total_memory'] = total_memory
    print(f"Total Memory: {total_memory}GB")
    print(f"Available Memory: {available_memory}GB")

    # Disk information
    disk = psutil.disk_usage('/')
    total_disk_space = disk.total // (1024 ** 3)  # Convert to GB
    used_disk_space = disk.used // (1024 ** 3)  # Convert to GB
    per['total_disk_space'] = total_disk_space
    per['used_disk_space'] = used_disk_space
    print(f"Total Disk Space: {total_disk_space}GB")
    print(f"Used Disk Space: {used_disk_space}GB")
    content.append(per)
    return JSONResponse(content=content)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000)
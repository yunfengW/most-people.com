endpoint=https://oss-rg-china-mainland.aliyuncs.com
accessKeyID=LTAI5tGNLAhk7knuBZYxzEK1
accessKeySecret=Qkv1LcRHi9GYPR3huN1u2AvNCTYJqJ

Bucket=most-people-com

# 查询所有文件
# ./bin/ossutil64 -e $endpoint -i $accessKeyID -k $accessKeySecret ls oss://$Bucket/

# 删除所有数据
./bin/ossutil64 rm -r -f oss://$Bucket/

# 上传本地文件夹
local_folder_name=.output/public
remote_folder_name=
./bin/ossutil64 -e $endpoint -i $accessKeyID -k $accessKeySecret cp -r $local_folder_name oss://$Bucket/$remote_folder_name
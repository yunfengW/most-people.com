npm run generate

endpoint=https://oss-rg-china-mainland.aliyuncs.com
# accessKeyID=
# accessKeySecret=

Bucket=most-people-com

# 查询所有文件
# ./bin/ossutil64 -e $endpoint -i $accessKeyID -k $accessKeySecret ls oss://$Bucket/

# 删除所有数据
./bin/ossutil64 rm -r -f oss://$Bucket/

# 上传本地文件夹
local_folder_name=.output/public
remote_folder_name=
# ./bin/ossutil64 -e $endpoint -i $accessKeyID -k $accessKeySecret cp -r $local_folder_name oss://$Bucket/$remote_folder_name


# https://help.aliyun.com/document_detail/120075.html
# 使用本地的 .ossutilconfig
./bin/ossutil64 cp -r $local_folder_name oss://$Bucket/$remote_folder_name
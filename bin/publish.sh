# https://help.aliyun.com/document_detail/120075.html

npm run generate

Endpoint=$ENDPOINT
AccessKeyID=$ACCESS_KEY_ID
AccessKeySecret=$ACCESS_KEY_SECRET
Bucket=$BUCKET

# 查询所有文件
# ./bin/ossutil64 -e $Endpoint -i $AccessKeyID -k $AccessKeySecret ls oss://$Bucket/

# 删除所有数据
./bin/ossutil64 rm -r -f oss://$Bucket/

# 上传本地文件夹
LocalFolder=.output/public
RemoteFolder=
./bin/ossutil64 -e $Endpoint -i $AccessKeyID -k $AccessKeySecret cp -r $LocalFolder oss://$Bucket/$RemoteFolder

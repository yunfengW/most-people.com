# https://help.aliyun.com/document_detail/120075.html

npm run generate

Endpoint=https://oss-rg-china-mainland.aliyuncs.com
AccessKeyID=$ACCESS_KEY_ID
AccessKeySecret=$ACCESS_KEY_SECRET
Bucket=most-people-com

# 查询所有文件
# ./bin/ossutil64 -e $Endpoint -i $AccessKeyID -k $AccessKeySecret ls oss://$Bucket/

# 上传本地文件夹
LocalFolder=.output/public
RemoteFolder=

if [ "$AccessKeyID" = "" ] && [ "$AccessKeySecret" = "" ]; then
    echo local
    # 使用本地的 .ossutilconfig
    # 删除所有数据
    ./bin/ossutil64 rm -r -f oss://$Bucket/
    # 重新上传
    ./bin/ossutil64 cp -r $LocalFolder oss://$Bucket/$RemoteFolder
else
    echo github actions
    ./bin/ossutil64 -e $Endpoint -i $AccessKeyID -k $AccessKeySecret rm -r -f oss://$Bucket/
    ./bin/ossutil64 -e $Endpoint -i $AccessKeyID -k $AccessKeySecret cp -r $LocalFolder oss://$Bucket/$RemoteFolder
fi

echo https://most-people.cn/
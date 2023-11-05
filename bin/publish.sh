# npm run generate

# https://support.huaweicloud.com/utiltg-obs/obs_11_0005.html
# 配置
# ./bin/obsutil config -i=ak -k=sk -e=$Endpoint

Bucket=mp-testnet

# 删除所有对象 https://support.huaweicloud.com/utiltg-obs/obs_11_0021.html
bin/obsutil rm obs://$Bucket -r -f


# 上传 https://support.huaweicloud.com/utiltg-obs/obs_11_0013.html
bin/obsutil cp .output/public obs://$Bucket/ -f -r -flat

echo https://testnet.most-people.cn/
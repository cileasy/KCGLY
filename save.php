<?php
$data = json_decode(file_get_contents('php://input'), true);
$success = file_put_contents('inventoryData.json', json_encode($data));
if ($success === false) {
    error_log("数据保存失败: ". json_last_error_msg());
    echo "数据保存失败，请检查服务器日志获取详细信息";
} else {
    echo "数据保存成功";
}
?>

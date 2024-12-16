<?php
$data = json_decode(file_get_contents('php://input'), true);
file_put_contents('inventoryData.json', json_encode($data));
echo "数据保存成功";
?>
#!/bin/bash
# 批量替换 expo-router 为 React Navigation

echo "Migrating from expo-router to React Navigation..."

# 替换所有文件中的导入
find ./app -name "*.tsx" -exec sed -i 's/from "expo-router";/from "@react-navigation\/native";/g' {} \;
find ./app -name "*.tsx" -exec sed -i 's/from "expo-router";/from "@react-navigation\/native";/g' {} \;

# 替换 router 为 navigation
find ./app -name "*.tsx" -exec sed -i 's/router\.replace/navigation.replace/g' {} \;
find ./app -name "*.tsx" -exec sed -i 's/router\.push/navigation.push/g' {} \;
find ./app -name "*.tsx" -exec sed -i 's/const router = useRouter();//g' {} \;
find ./app -name "*.tsx" -exec sed -i 's/import { useRouter } from "expo-router";//g' {} \;

# 替换 Link 组件
find ./app -name "*.tsx" -exec sed -i 's/<Link href="\([^"]*\)"/<Link to="\1"/g' {} \;

echo "Migration complete!"

echo "Results:"
echo "--------------------------------------------------------------------------------\n"
arg=$1
curl --request POST \
  --header 'content-type: application/json' \
  --url http://localhost:8080/graphql \
  --data "{\"query\":\"$arg\"}"

echo "\n--------------------------------------------------------------------------------"
echo "QUERY: $arg"
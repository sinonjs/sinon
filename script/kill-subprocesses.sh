function finish {
    if [ -n "${TRAVIS+1}" ]; then
        echo "TRAVIS detected, skip killing child processes"
    else
        echo "Tidying up child processes"
        kill $(jobs -pr)
    fi
}

trap finish SIGINT SIGTERM EXIT

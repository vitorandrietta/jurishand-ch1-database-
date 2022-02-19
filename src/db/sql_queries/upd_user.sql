
-- if our main goal was to partially update the user according to the provided
-- fields we could also pass a JSON as a string and parse it to a table
-- on execution time and update the user table based on it's value, 
-- which is a much cleaner solution in comparison to evaluating a string directly
-- in terms of avoiding SQL or other security problems.


CREATE OR REPLACE PROCEDURE UPD_USER(BASE_ID INT,  FIELD varchar(30), NEW_VALUE varchar(200))
LANGUAGE plpgsql  AS  
$$  
BEGIN
    EXECUTE FORMAT('UPDATE BASE_USER SET %s = ''%s'' WHERE BASE_USER.ID = %s;', FIELD, NEW_VALUE, BASE_ID);
END
$$;

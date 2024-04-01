<script>
    export let text;
    export let action;
  </script>
  
  <button on:click={action}>
    {text}
    <span class="arrow">→</span>
  </button>
  
  <style>
    button {
    padding: 12px 20px;
    font-size: 16px;
    background-color: transparent;
    border: none;
    cursor: pointer;
    color: #000;
    text-align: left;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  

}   
   </style>
  